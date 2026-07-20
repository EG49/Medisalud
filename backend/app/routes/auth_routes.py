"""Endpoints que consume frontend/src/api/authApi.js.

El registro acepta el rol por body ({"rol": "medico"}) o por ruta dedicada
(/registro/medico) — el default sigue siendo paciente, que es el caso común.
"""

from flask import Blueprint, request

from app.services import auth_service

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/registro")
def registro():
    datos = request.get_json(silent=True) or {}
    rol = (datos.get("rol") or "paciente").strip()
    return auth_service.registrar_usuario(datos, rol), 201


@auth_bp.post("/registro/<rol>")
def registro_por_rol(rol):
    return auth_service.registrar_usuario(request.get_json(silent=True) or {}, rol), 201


@auth_bp.post("/enviar-codigo")
def enviar_codigo():
    return auth_service.enviar_codigo(request.get_json(silent=True) or {})


@auth_bp.post("/login")
def login():
    return auth_service.iniciar_sesion(request.get_json(silent=True) or {})
