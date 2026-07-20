"""Autenticación por token firmado (itsdangerous, ya viene con Flask).

Flujo:
  1. POST /api/auth/login devuelve {token, usuario}.
  2. El cliente manda el token en cada request: Authorization: Bearer <token>.
  3. Las rutas protegidas usan @requiere_auth(...) y leen g.usuario.
"""

from functools import wraps

from flask import current_app, g, request
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from app.errors import ApiError
from app.extensions import db
from app.models import Usuario

TOKEN_MAX_AGE_SEGUNDOS = 12 * 60 * 60  # 12 horas


def _serializer():
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"], salt="medisalud-auth")


def generar_token(usuario):
    return _serializer().dumps({"id": usuario.id, "rol": usuario.rol.value})


def requiere_auth(*roles):
    """Protege una ruta. Sin argumentos acepta cualquier rol autenticado;
    con argumentos, solo esos roles: @requiere_auth("paciente")."""

    def decorador(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            header = request.headers.get("Authorization", "")
            if not header.startswith("Bearer "):
                raise ApiError("Falta el token de autorización (header Authorization: Bearer <token>).", 401)

            try:
                data = _serializer().loads(header[len("Bearer "):], max_age=TOKEN_MAX_AGE_SEGUNDOS)
            except SignatureExpired:
                raise ApiError("La sesión expiró, vuelve a iniciar sesión.", 401)
            except BadSignature:
                raise ApiError("Token inválido.", 401)

            usuario = db.session.get(Usuario, data["id"])
            if not usuario or not usuario.activo:
                raise ApiError("Usuario no encontrado o inactivo.", 401)
            if roles and usuario.rol.value not in roles:
                raise ApiError("No tienes permiso para acceder a este recurso.", 403)

            g.usuario = usuario
            return fn(*args, **kwargs)

        return wrapper

    return decorador
