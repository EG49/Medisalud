"""Registro e inicio de sesión sin contraseña: el usuario se identifica con
cédula + celular y confirma con un código de verificación de 6 dígitos.

MODO DEV: el código NO se envía por SMS — se imprime en la consola del
servidor Flask (y se incluye en la respuesta si DEBUG está activo). Para
producción se integraría un proveedor de SMS (p. ej. Twilio) en _enviar_sms().
"""

import random
import time
from datetime import date

from flask import current_app

from app.errors import ApiError
from app.extensions import db
from app.middleware.auth import generar_token
from app.models import PerfilPaciente, Usuario
from app.models.enums import RolUsuario
from app.schemas.usuario_schema import serializar_usuario

CODIGO_VIGENCIA_SEGUNDOS = 5 * 60

# Códigos pendientes en memoria: {usuario_id: (codigo, expira_epoch)}.
# Suficiente para desarrollo; en producción iría en Redis o en una tabla.
_codigos_pendientes = {}


def _buscar_usuario(cedula, celular):
    usuario = Usuario.query.filter_by(cedula=cedula, celular=celular).first()
    if not usuario:
        raise ApiError("No encontramos una cuenta con esa cédula y celular. Verifica los datos o regístrate.", 404)
    if not usuario.activo:
        raise ApiError("Esta cuenta está desactivada.", 403)
    return usuario


def _enviar_sms(celular, codigo):
    # DEV: solo lo mostramos en la consola del servidor.
    print(f"\n  [MediSalud DEV] Código de verificación para {celular}: {codigo}\n")


def registrar_usuario(datos):
    requeridos = ["nombre", "apellidos", "cedula", "celular"]
    faltantes = [c for c in requeridos if not (datos.get(c) or "").strip()]
    if faltantes:
        raise ApiError(f"Faltan campos obligatorios: {', '.join(faltantes)}.")

    if Usuario.query.filter_by(cedula=datos["cedula"].strip()).first():
        raise ApiError("Ya existe una cuenta registrada con esa cédula.", 409)
    if Usuario.query.filter_by(celular=datos["celular"].strip()).first():
        raise ApiError("Ya existe una cuenta registrada con ese celular.", 409)

    usuario = Usuario(
        nombre=datos["nombre"].strip(),
        apellidos=datos["apellidos"].strip(),
        cedula=datos["cedula"].strip(),
        celular=datos["celular"].strip(),
        rol=RolUsuario.paciente,
    )
    fecha_nacimiento = None
    if datos.get("fecha_nacimiento"):
        try:
            fecha_nacimiento = date.fromisoformat(str(datos["fecha_nacimiento"])[:10])
        except ValueError:
            raise ApiError("La fecha de nacimiento no tiene un formato válido (AAAA-MM-DD).")

    usuario.perfil_paciente = PerfilPaciente(fecha_nacimiento=fecha_nacimiento)
    db.session.add(usuario)
    db.session.commit()
    return serializar_usuario(usuario)


def enviar_codigo(datos):
    usuario = _buscar_usuario((datos.get("cedula") or "").strip(), (datos.get("celular") or "").strip())

    codigo = f"{random.randint(0, 999999):06d}"
    _codigos_pendientes[usuario.id] = (codigo, time.time() + CODIGO_VIGENCIA_SEGUNDOS)
    _enviar_sms(usuario.celular, codigo)

    respuesta = {"mensaje": "Te enviamos un código de verificación a tu celular."}
    if current_app.debug:
        respuesta["codigoDev"] = codigo  # visible solo en modo debug
    return respuesta


def iniciar_sesion(datos):
    usuario = _buscar_usuario((datos.get("cedula") or "").strip(), (datos.get("celular") or "").strip())

    pendiente = _codigos_pendientes.get(usuario.id)
    if not pendiente:
        raise ApiError("Primero solicita un código de verificación.", 400)

    codigo_guardado, expira = pendiente
    if time.time() > expira:
        _codigos_pendientes.pop(usuario.id, None)
        raise ApiError("El código expiró. Solicita uno nuevo.", 400)
    if (datos.get("codigo") or "").strip() != codigo_guardado:
        raise ApiError("El código no es correcto.", 401)

    _codigos_pendientes.pop(usuario.id, None)
    return {"token": generar_token(usuario), "usuario": serializar_usuario(usuario)}
