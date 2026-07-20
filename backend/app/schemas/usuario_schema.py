def usuario_a_dict(usuario):
    return {
        "id": usuario.id,
        "nombre": usuario.nombre,
        "apellidos": usuario.apellidos,
        "cedula": usuario.cedula,
        "celular": usuario.celular,
        "rol": usuario.rol.value,
    }
