import random
from datetime import datetime, timedelta

from app.repositories import usuario_repository

# TODO: esto es un almacén EN MEMORIA -- se pierde si el servidor se reinicia
# y no funciona si corres más de un proceso de Flask a la vez. Sirve para
# desarrollo. Antes de producción, mover esto a Redis (con expiración nativa)
# o a una tabla de base de datos con índice por celular.
_codigos_pendientes = {}

DURACION_CODIGO_MINUTOS = 5


class AuthError(Exception):
    """Error de negocio de autenticación -- la ruta lo convierte en HTTP 400."""


def solicitar_codigo(cedula, celular):
    codigo = f"{random.randint(0, 999999):06d}"
    expira_en = datetime.utcnow() + timedelta(minutes=DURACION_CODIGO_MINUTOS)
    _codigos_pendientes[celular] = {"codigo": codigo, "expira_en": expira_en, "cedula": cedula}

    # TODO: reemplazar este print por el envío real de SMS (Twilio, AWS SNS, etc.)
    # cuando se contrate un proveedor. Por ahora, el código queda visible en la
    # consola del backend para poder probar el flujo completo.
    print(f"[DEV] Código de verificación para {celular}: {codigo}")

    return {"enviado": True}


def verificar_codigo(celular, codigo):
    pendiente = _codigos_pendientes.get(celular)
    if not pendiente:
        raise AuthError("No se ha solicitado un código para este celular.")
    if datetime.utcnow() > pendiente["expira_en"]:
        del _codigos_pendientes[celular]
        raise AuthError("El código expiró, solicita uno nuevo.")
    if pendiente["codigo"] != codigo:
        raise AuthError("Código incorrecto.")

    del _codigos_pendientes[celular]  # un código solo se usa una vez
    return True


def login(cedula, celular, codigo):
    verificar_codigo(celular, codigo)

    usuario = usuario_repository.buscar_por_cedula_y_celular(cedula, celular)
    if not usuario:
        raise AuthError("No existe una cuenta con esa cédula y celular.")
    if not usuario.activo:
        raise AuthError("Esta cuenta está desactivada.")

    return usuario


# Roles que SÍ pueden registrarse por este endpoint público.
# 'admin' queda deliberadamente fuera -- esas cuentas se crean por un canal
# aparte y controlado (ver backend/scripts/crear_admin.py), nunca por un
# formulario abierto al público.
ROLES_REGISTRO_PUBLICO = {"paciente", "medico", "repartidor"}


def registrar(rol, datos):
    if rol not in ROLES_REGISTRO_PUBLICO:
        raise AuthError("Ese rol no puede registrarse por este medio.")

    cedula = datos.get("cedula")
    celular = datos.get("celular")

    if usuario_repository.buscar_por_cedula(cedula):
        raise AuthError("Ya existe una cuenta con esa cédula.")
    if usuario_repository.buscar_por_celular(celular):
        raise AuthError("Ya existe una cuenta con ese celular.")

    if rol == "paciente":
        campos_faltantes = [
            c for c in ("nombre", "apellidos", "cedula", "celular", "fecha_nacimiento") if not datos.get(c)
        ]
        if campos_faltantes:
            raise AuthError(f"Faltan campos: {', '.join(campos_faltantes)}")
        try:
            fecha_nacimiento = datetime.strptime(datos["fecha_nacimiento"], "%Y-%m-%d").date()
        except ValueError:
            raise AuthError("fecha_nacimiento debe tener formato YYYY-MM-DD.")
        return usuario_repository.crear_paciente(
            nombre=datos["nombre"],
            apellidos=datos["apellidos"],
            cedula=cedula,
            celular=celular,
            fecha_nacimiento=fecha_nacimiento,
        )

    if rol == "medico":
        campos_faltantes = [
            c for c in ("nombre", "apellidos", "cedula", "celular", "especialidad", "num_licencia")
            if not datos.get(c)
        ]
        if campos_faltantes:
            raise AuthError(f"Faltan campos: {', '.join(campos_faltantes)}")
        return usuario_repository.crear_medico(
            nombre=datos["nombre"],
            apellidos=datos["apellidos"],
            cedula=cedula,
            celular=celular,
            especialidad=datos["especialidad"],
            num_licencia=datos["num_licencia"],
        )

    if rol == "repartidor":
        campos_faltantes = [
            c for c in ("nombre", "apellidos", "cedula", "celular", "vehiculo", "zona_cobertura")
            if not datos.get(c)
        ]
        if campos_faltantes:
            raise AuthError(f"Faltan campos: {', '.join(campos_faltantes)}")
        return usuario_repository.crear_repartidor(
            nombre=datos["nombre"],
            apellidos=datos["apellidos"],
            cedula=cedula,
            celular=celular,
            vehiculo=datos["vehiculo"],
            zona_cobertura=datos["zona_cobertura"],
        )
