"""Endpoints que frontend/src/api/authApi.js ya consume."""

from flask import Blueprint, request

from app.services import auth_service

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/registro")
def registro():
    return auth_service.registrar_usuario(request.get_json(silent=True) or {}), 201


@auth_bp.post("/enviar-codigo")
def enviar_codigo():
    return auth_service.enviar_codigo(request.get_json(silent=True) or {})


@auth_bp.post("/login")
def login():
    return auth_service.iniciar_sesion(request.get_json(silent=True) or {})
