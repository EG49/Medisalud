from app.schemas import iso, nombre_completo


def serializar_usuario(usuario):
    """Usuario básico — lo que devuelve el login y el registro."""
    return {
        "id": usuario.id,
        "nombre": usuario.nombre,
        "apellidos": usuario.apellidos,
        "cedula": usuario.cedula,
        "celular": usuario.celular,
        "rol": usuario.rol.value,
    }


def serializar_perfil_paciente(usuario):
    """Mismo formato que mockPerfil.js."""
    perfil = usuario.perfil_paciente
    return {
        "nombre": usuario.nombre,
        "apellidos": usuario.apellidos,
        "cedula": usuario.cedula,
        "fechaNacimiento": iso(perfil.fecha_nacimiento) if perfil else None,
        "celular": usuario.celular,
        # El modelo Usuario aún no tiene columna de foto; la subida de foto
        # queda pendiente (ver nota en frontend/src/api/authApi.js).
        "fotoUrl": None,
        "contactoEmergenciaNombre": perfil.contacto_emergencia_nombre if perfil else None,
        "contactoEmergenciaTelefono": perfil.contacto_emergencia_telefono if perfil else None,
        "alergias": perfil.alergias if perfil else None,
        "direccion": perfil.direccion if perfil else None,
    }


def serializar_medico_resumen(perfil_medico):
    """Sub-objeto medico: {nombre, especialidad} — como en mockRecetas.js."""
    return {
        "nombre": nombre_completo(perfil_medico.usuario),
        "especialidad": perfil_medico.especialidad,
    }
