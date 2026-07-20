from datetime import datetime

from app.errors import ApiError
from app.extensions import db
from app.models import Farmacia, Pedido, PedidoDetalle, RecetaItem
from app.models.enums import EstadoPedido
from app.schemas.pedido_schema import serializar_pedido_activo, serializar_pedido_historial
from app.services import notificacion_service

# Estados "vivos" — un pedido en cualquiera de estos aparece como activo.
ESTADOS_ACTIVOS = [
    EstadoPedido.solicitado,
    EstadoPedido.confirmado,
    EstadoPedido.en_preparacion,
    EstadoPedido.en_camino,
]

# Orden válido de avance (el repartidor solo puede avanzar hacia adelante).
ORDEN_ESTADOS = [
    EstadoPedido.solicitado,
    EstadoPedido.confirmado,
    EstadoPedido.en_preparacion,
    EstadoPedido.en_camino,
    EstadoPedido.entregado,
]

MENSAJES_ESTADO = {
    EstadoPedido.confirmado: "Tu pedido fue confirmado.",
    EstadoPedido.en_preparacion: "Tu pedido está en preparación.",
    EstadoPedido.en_camino: "Tu pedido está en camino.",
    EstadoPedido.entregado: "Tu pedido fue entregado.",
}


def listar_pedidos_paciente(paciente_id):
    """Devuelve {activo, historial} — lo que consume PedidosPage."""
    pedidos = (
        Pedido.query.filter_by(paciente_id=paciente_id)
        .order_by(Pedido.creado_en.desc())
        .all()
    )
    activo = next((p for p in pedidos if p.estado in ESTADOS_ACTIVOS), None)
    historial = [p for p in pedidos if p.estado not in ESTADOS_ACTIVOS]
    return {
        "activo": serializar_pedido_activo(activo) if activo else None,
        "historial": [serializar_pedido_historial(p) for p in historial],
    }


def solicitar_pedido(usuario, datos, paciente_id=None, cuidador_id=None):
    """Crea un pedido a partir de items de receta del paciente.
    body: {direccionEntrega?, items: [{recetaItemId, farmaciaId, cantidad}]}
    Si direccionEntrega no viene, se usa la dirección del perfil."""
    paciente_id = paciente_id or usuario.id
    perfil = usuario.perfil_paciente if paciente_id == usuario.id else None

    items = datos.get("items") or []
    if not items:
        raise ApiError("El pedido necesita al menos un medicamento.")

    direccion = (datos.get("direccionEntrega") or "").strip()
    if not direccion and perfil:
        direccion = perfil.direccion or ""
    if not direccion:
        raise ApiError("Falta la dirección de entrega (y el perfil no tiene una guardada).")

    ya_activo = Pedido.query.filter(
        Pedido.paciente_id == paciente_id, Pedido.estado.in_(ESTADOS_ACTIVOS)
    ).first()
    if ya_activo:
        raise ApiError("Ya hay un pedido en curso. Espera a que se entregue o cancélalo.", 409)

    pedido = Pedido(paciente_id=paciente_id, cuidador_id=cuidador_id, direccion_entrega=direccion)

    for item in items:
        receta_item = db.session.get(RecetaItem, item.get("recetaItemId"))
        if not receta_item or receta_item.receta.paciente_id != paciente_id:
            raise ApiError("Uno de los medicamentos no pertenece a una receta del paciente.", 400)
        if not receta_item.activa:
            raise ApiError(
                f"El tratamiento de {receta_item.medicamento.nombre} está suspendido; no se puede pedir.", 400
            )
        farmacia = db.session.get(Farmacia, item.get("farmaciaId"))
        if not farmacia:
            raise ApiError("Farmacia no encontrada.", 404)
        cantidad = item.get("cantidad")
        if not isinstance(cantidad, int) or cantidad <= 0:
            raise ApiError("La cantidad solicitada debe ser un número mayor a 0.")

        pedido.detalles.append(
            PedidoDetalle(
                receta_item_id=receta_item.id,
                farmacia_id=farmacia.id,
                cantidad_solicitada=cantidad,
            )
        )

    db.session.add(pedido)
    notificacion_service.notificar(paciente_id, "pedido", "Tu pedido fue solicitado.")
    db.session.commit()
    return serializar_pedido_activo(pedido)


def cancelar_pedido(paciente_id, pedido_id):
    pedido = db.session.get(Pedido, pedido_id)
    if not pedido or pedido.paciente_id != paciente_id:
        raise ApiError("Pedido no encontrado.", 404)
    if pedido.estado in (EstadoPedido.entregado, EstadoPedido.cancelado):
        raise ApiError("Este pedido ya no se puede cancelar.", 409)
    if pedido.estado == EstadoPedido.en_camino:
        raise ApiError("El pedido ya está en camino; contacta al repartidor para cancelarlo.", 409)

    pedido.estado = EstadoPedido.cancelado
    notificacion_service.notificar(paciente_id, "pedido", "Tu pedido fue cancelado.")
    db.session.commit()
    return serializar_pedido_historial(pedido)


def avanzar_estado(pedido, nuevo_estado):
    """Valida la transición y notifica al paciente. NO hace commit."""
    try:
        estado = EstadoPedido(nuevo_estado)
    except ValueError:
        raise ApiError(f"Estado desconocido: {nuevo_estado}.")

    if estado not in ORDEN_ESTADOS:
        raise ApiError("Ese estado no se puede asignar manualmente.")
    if pedido.estado in (EstadoPedido.entregado, EstadoPedido.cancelado):
        raise ApiError("El pedido ya está cerrado.", 409)
    if ORDEN_ESTADOS.index(estado) <= ORDEN_ESTADOS.index(pedido.estado):
        raise ApiError(
            f"No se puede pasar de '{pedido.estado.value}' a '{estado.value}' (solo se avanza).", 409
        )

    pedido.estado = estado
    if estado == EstadoPedido.entregado:
        pedido.entregado_en = datetime.utcnow()
    notificacion_service.notificar(pedido.paciente_id, "pedido", MENSAJES_ESTADO[estado])
