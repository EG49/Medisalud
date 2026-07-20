from app.errors import ApiError
from app.extensions import db
from app.models import Pedido
from app.models.enums import EstadoPedido
from app.schemas import iso
from app.schemas.pedido_schema import serializar_pedido_activo
from app.services.pedido_service import ESTADOS_ACTIVOS, avanzar_estado


def _serializar_para_repartidor(pedido):
    datos = serializar_pedido_activo(pedido)
    datos["creadoEn"] = iso(pedido.creado_en)
    return datos


def listar_pedidos(repartidor_id):
    """Pedidos disponibles (sin repartidor asignado, aún activos) y los míos."""
    disponibles = Pedido.query.filter(
        Pedido.repartidor_id.is_(None), Pedido.estado.in_(ESTADOS_ACTIVOS)
    ).order_by(Pedido.creado_en.asc()).all()

    mios = Pedido.query.filter_by(repartidor_id=repartidor_id).order_by(
        Pedido.creado_en.desc()
    ).all()

    return {
        "disponibles": [_serializar_para_repartidor(p) for p in disponibles],
        "asignados": [_serializar_para_repartidor(p) for p in mios],
    }


def tomar_pedido(repartidor_id, pedido_id):
    pedido = db.session.get(Pedido, pedido_id)
    if not pedido:
        raise ApiError("Pedido no encontrado.", 404)
    if pedido.estado not in ESTADOS_ACTIVOS:
        raise ApiError("Este pedido ya está cerrado.", 409)
    if pedido.repartidor_id and pedido.repartidor_id != repartidor_id:
        raise ApiError("Otro repartidor ya tomó este pedido.", 409)

    pedido.repartidor_id = repartidor_id
    db.session.commit()
    return _serializar_para_repartidor(pedido)


def cambiar_estado(repartidor_id, pedido_id, nuevo_estado):
    pedido = db.session.get(Pedido, pedido_id)
    if not pedido or pedido.repartidor_id != repartidor_id:
        raise ApiError("Pedido no encontrado (¿ya lo tomaste con /tomar?).", 404)

    avanzar_estado(pedido, nuevo_estado)
    db.session.commit()
    return _serializar_para_repartidor(pedido)
