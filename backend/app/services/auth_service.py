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


def registrar(nombre, apellidos, cedula, celular, fecha_nacimiento):
    if usuario_repository.buscar_por_cedula(cedula):
        raise AuthError("Ya existe una cuenta con esa cédula.")
    if usuario_repository.buscar_por_celular(celular):
        raise AuthError("Ya existe una cuenta con ese celular.")

    return usuario_repository.crear_paciente(
        nombre=nombre,
        apellidos=apellidos,
        cedula=cedula,
        celular=celular,
        fecha_nacimiento=fecha_nacimiento,
    )
