"""Lado del cuidador: solicitar acceso a un paciente y responder invitaciones.
Cualquier usuario autenticado puede actuar como cuidador de otro."""

from flask import Blueprint, g, request

from app.middleware.auth import requiere_auth
from app.services import cuidador_service

cuidador_bp = Blueprint("cuidador", __name__)


@cuidador_bp.post("/solicitar")
@requiere_auth()
def solicitar_acceso():
    return cuidador_service.solicitar_acceso(g.usuario, request.get_json(silent=True) or {}), 201


@cuidador_bp.get("/invitaciones")
@requiere_auth()
def listar_invitaciones():
    return cuidador_service.listar_invitaciones_del_cuidador(g.usuario.id)


@cuidador_bp.post("/invitaciones/<vinculo_id>/aceptar")
@requiere_auth()
def aceptar_invitacion(vinculo_id):
    return cuidador_service.responder_invitacion(g.usuario, vinculo_id, aceptar=True)


@cuidador_bp.post("/invitaciones/<vinculo_id>/rechazar")
@requiere_auth()
def rechazar_invitacion(vinculo_id):
    return cuidador_service.responder_invitacion(g.usuario, vinculo_id, aceptar=False)
