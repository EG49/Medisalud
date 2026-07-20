from datetime import date

from app.errors import ApiError
from app.extensions import db
from app.models import PerfilPaciente
from app.schemas.usuario_schema import serializar_perfil_paciente

# Qué campos puede editar el propio paciente y a qué columna van.
CAMPOS_USUARIO = {"nombre": "nombre", "apellidos": "apellidos", "celular": "celular"}
CAMPOS_PERFIL = {
    "direccion": "direccion",
    "alergias": "alergias",
    "contactoEmergenciaNombre": "contacto_emergencia_nombre",
    "contactoEmergenciaTelefono": "contacto_emergencia_telefono",
}


def obtener_perfil(usuario):
    return serializar_perfil_paciente(usuario)


def actualizar_perfil(usuario, datos):
    if usuario.perfil_paciente is None:
        usuario.perfil_paciente = PerfilPaciente()

    for clave, columna in CAMPOS_USUARIO.items():
        if clave in datos:
            valor = (datos[clave] or "").strip()
            if not valor and clave in ("nombre", "apellidos"):
                raise ApiError(f"El campo {clave} no puede quedar vacío.")
            setattr(usuario, columna, valor or None)

    for clave, columna in CAMPOS_PERFIL.items():
        if clave in datos:
            setattr(usuario.perfil_paciente, columna, (datos[clave] or "").strip() or None)

    if "fechaNacimiento" in datos:
        valor = datos["fechaNacimiento"]
        if valor:
            try:
                usuario.perfil_paciente.fecha_nacimiento = date.fromisoformat(str(valor)[:10])
            except ValueError:
                raise ApiError("La fecha de nacimiento no tiene un formato válido (AAAA-MM-DD).")
        else:
            usuario.perfil_paciente.fecha_nacimiento = None

    db.session.commit()
    return serializar_perfil_paciente(usuario)
