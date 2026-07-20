"""Registro e inicio de sesión sin contraseña: el usuario se identifica con
cédula + celular y confirma con un código de verificación de 6 dígitos.

MODO DEV: el código NO se envía por SMS — se imprime en la consola del
servidor Flask (y se incluye en la respuesta si DEBUG está activo). Para
producción se integraría un proveedor de SMS (p. ej. Twilio) en _enviar_sms().

El registro es por ROL (paciente / médico / repartidor). La creación de cada
tipo de usuario se delega a app/repositories/usuario_repository.py.
"""

import random
import time
from datetime import datetime

from flask import current_app

from app.errors import ApiError
from app.middleware.auth import generar_token
from app.repositories import usuario_repository
from app.schemas.usuario_schema import serializar_usuario

CODIGO_VIGENCIA_SEGUNDOS = 5 * 60

# Roles que SÍ pueden registrarse por este endpoint público.
# 'admin' y 'cuidador' quedan deliberadamente fuera: las cuentas de admin se
# crean por un canal controlado (backend/scripts/crear_admin.py) y el cuidador
# nace de una invitación de un paciente, nunca de un formulario abierto.
ROLES_REGISTRO_PUBLICO = ("paciente", "medico", "repartidor")

# Campos obligatorios propios de cada rol (además de los comunes).
CAMPOS_POR_ROL = {
    "paciente": ("fecha_nacimiento",),
    "medico": ("especialidad", "num_licencia"),
    "repartidor": ("vehiculo", "zona_cobertura"),
}

CAMPOS_COMUNES = ("nombre", "apellidos", "cedula", "celular")

# TODO: almacén EN MEMORIA — se pierde si el servidor se reinicia y no sirve
# con más de un proceso de Flask. Suficiente para desarrollo; antes de
# producción moverlo a Redis (con expiración nativa) o a una tabla indexada.
# {usuario_id: (codigo, expira_epoch)}
_codigos_pendientes = {}


def _buscar_usuario(cedula, celular):
    usuario = usuario_repository.buscar_por_cedula_y_celular(cedula, celular)
    if not usuario:
        raise ApiError(
            "No encontramos una cuenta con esa cédula y celular. Verifica los datos o regístrate.",
            404,
        )
    if not usuario.activo:
        raise ApiError("Esta cuenta está desactivada.", 403)
    return usuario


def _enviar_sms(celular, codigo):
    # DEV: solo lo mostramos en la consola del servidor.
    print(f"\n  [MediSalud DEV] Código de verificación para {celular}: {codigo}\n")


def _validar_campos(rol, datos):
    requeridos = CAMPOS_COMUNES + CAMPOS_POR_ROL[rol]
    faltantes = [c for c in requeridos if not str(datos.get(c) or "").strip()]
    if faltantes:
        raise ApiError(f"Faltan campos obligatorios: {', '.join(faltantes)}.")


def registrar_usuario(datos, rol="paciente"):
    """Crea una cuenta del rol indicado. Devuelve el usuario serializado."""
    if rol not in ROLES_REGISTRO_PUBLICO:
        raise ApiError("Ese tipo de cuenta no puede registrarse por este medio.", 403)

    _validar_campos(rol, datos)

    cedula = datos["cedula"].strip()
    celular = datos["celular"].strip()

    if usuario_repository.buscar_por_cedula(cedula):
        raise ApiError("Ya existe una cuenta registrada con esa cédula.", 409)
    if usuario_repository.buscar_por_celular(celular):
        raise ApiError("Ya existe una cuenta registrada con ese celular.", 409)

    comunes = {
        "nombre": datos["nombre"].strip(),
        "apellidos": datos["apellidos"].strip(),
        "cedula": cedula,
        "celular": celular,
    }

    if rol == "paciente":
        try:
            fecha_nacimiento = datetime.strptime(
                str(datos["fecha_nacimiento"])[:10], "%Y-%m-%d"
            ).date()
        except ValueError:
            raise ApiError("La fecha de nacimiento debe tener formato AAAA-MM-DD.")
        usuario = usuario_repository.crear_paciente(
            **comunes, fecha_nacimiento=fecha_nacimiento
        )
    elif rol == "medico":
        usuario = usuario_repository.crear_medico(
            **comunes,
            especialidad=datos["especialidad"].strip(),
            num_licencia=datos["num_licencia"].strip(),
        )
    else:
        usuario = usuario_repository.crear_repartidor(
            **comunes,
            vehiculo=datos["vehiculo"].strip(),
            zona_cobertura=datos["zona_cobertura"].strip(),
        )

    return serializar_usuario(usuario)


def enviar_codigo(datos):
    usuario = _buscar_usuario(
        (datos.get("cedula") or "").strip(), (datos.get("celular") or "").strip()
    )

    codigo = f"{random.randint(0, 999999):06d}"
    _codigos_pendientes[usuario.id] = (codigo, time.time() + CODIGO_VIGENCIA_SEGUNDOS)
    _enviar_sms(usuario.celular, codigo)

    respuesta = {"mensaje": "Te enviamos un código de verificación a tu celular."}
    if current_app.debug or current_app.config.get("TESTING"):
        respuesta["codigoDev"] = codigo  # visible solo en desarrollo/pruebas
    return respuesta


def iniciar_sesion(datos):
    usuario = _buscar_usuario(
        (datos.get("cedula") or "").strip(), (datos.get("celular") or "").strip()
    )

    pendiente = _codigos_pendientes.get(usuario.id)
    if not pendiente:
        raise ApiError("Primero solicita un código de verificación.", 400)

    codigo_guardado, expira = pendiente
    if time.time() > expira:
        _codigos_pendientes.pop(usuario.id, None)
        raise ApiError("El código expiró. Solicita uno nuevo.", 400)
    if (datos.get("codigo") or "").strip() != codigo_guardado:
        raise ApiError("El código no es correcto.", 401)

    _codigos_pendientes.pop(usuario.id, None)  # un código solo se usa una vez
    return {"token": generar_token(usuario), "usuario": serializar_usuario(usuario)}
