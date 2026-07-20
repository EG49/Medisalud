"""Endpoints del dashboard del paciente. Reemplazan, uno a uno, los mocks de
frontend/src/features/paciente/ (los comentarios de cada mock indican la ruta)."""

from flask import Blueprint, g, request

from app.middleware.auth import requiere_auth
from app.models import Examen, Receta
from app.schemas.examen_schema import serializar_examen
from app.schemas.receta_schema import serializar_receta
from app.services import (
    cuidador_service,
    notificacion_service,
    pedido_service,
    perfil_service,
)

paciente_bp = Blueprint("paciente", __name__)


# ---- Perfil ----

@paciente_bp.get("/perfil")
@requiere_auth("paciente")
def obtener_perfil():
    return perfil_service.obtener_perfil(g.usuario)


@paciente_bp.put("/perfil")
@requiere_auth("paciente")
def actualizar_perfil():
    return perfil_service.actualizar_perfil(g.usuario, request.get_json(silent=True) or {})


# ---- Recetas y exámenes (solo lectura: los crea el médico) ----

@paciente_bp.get("/recetas")
@requiere_auth("paciente")
def listar_recetas():
    recetas = (
        Receta.query.filter_by(paciente_id=g.usuario.id)
        .order_by(Receta.fecha_emision.desc())
        .all()
    )
    return [serializar_receta(r) for r in recetas]


@paciente_bp.get("/examenes")
@requiere_auth("paciente")
def listar_examenes():
    examenes = (
        Examen.query.filter_by(paciente_id=g.usuario.id).order_by(Examen.fecha.desc()).all()
    )
    return [serializar_examen(e) for e in examenes]


# ---- Pedidos ----

@paciente_bp.get("/pedidos")
@requiere_auth("paciente")
def listar_pedidos():
    return pedido_service.listar_pedidos_paciente(g.usuario.id)


@paciente_bp.post("/pedidos")
@requiere_auth("paciente")
def solicitar_pedido():
    return pedido_service.solicitar_pedido(g.usuario, request.get_json(silent=True) or {}), 201


@paciente_bp.post("/pedidos/<pedido_id>/cancelar")
@requiere_auth("paciente")
def cancelar_pedido(pedido_id):
    return pedido_service.cancelar_pedido(g.usuario.id, pedido_id)


# ---- Notificaciones ----

@paciente_bp.get("/notificaciones")
@requiere_auth("paciente")
def listar_notificaciones():
    return notificacion_service.listar(g.usuario)


@paciente_bp.post("/notificaciones/<notificacion_id>/leer")
@requiere_auth("paciente")
def marcar_notificacion(notificacion_id):
    return notificacion_service.marcar_leida(g.usuario, notificacion_id)


@paciente_bp.post("/notificaciones/leer-todas")
@requiere_auth("paciente")
def marcar_todas():
    return notificacion_service.marcar_todas_leidas(g.usuario)


# ---- Cuidadores ----

@paciente_bp.get("/cuidadores")
@requiere_auth("paciente")
def listar_cuidadores():
    return cuidador_service.listar_para_paciente(g.usuario.id)


@paciente_bp.post("/cuidadores/invitar")
@requiere_auth("paciente")
def invitar_cuidador():
    return cuidador_service.invitar(g.usuario, request.get_json(silent=True) or {}), 201


@paciente_bp.post("/cuidadores/solicitudes/<vinculo_id>/aprobar")
@requiere_auth("paciente")
def aprobar_solicitud(vinculo_id):
    return cuidador_service.responder_solicitud(g.usuario, vinculo_id, aprobar=True)


@paciente_bp.post("/cuidadores/solicitudes/<vinculo_id>/rechazar")
@requiere_auth("paciente")
def rechazar_solicitud(vinculo_id):
    return cuidador_service.responder_solicitud(g.usuario, vinculo_id, aprobar=False)


@paciente_bp.patch("/cuidadores/<vinculo_id>")
@requiere_auth("paciente")
def actualizar_cuidador(vinculo_id):
    datos = request.get_json(silent=True) or {}
    return cuidador_service.actualizar_autorizacion(
        g.usuario.id, vinculo_id, datos.get("autorizadoPedidos")
    )


@paciente_bp.delete("/cuidadores/<vinculo_id>")
@requiere_auth("paciente")
def eliminar_cuidador(vinculo_id):
    return cuidador_service.eliminar_vinculo(g.usuario.id, vinculo_id)
