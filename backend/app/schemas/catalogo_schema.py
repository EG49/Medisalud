def serializar_farmacia(farmacia):
    return {
        "id": farmacia.id,
        "nombre": farmacia.nombre,
        "logoUrl": farmacia.logo_url,
        "direccion": farmacia.direccion,
        "telefonoContacto": farmacia.telefono_contacto,
    }


def serializar_medicamento(medicamento):
    return {
        "id": medicamento.id,
        "nombre": medicamento.nombre,
        "presentacion": medicamento.presentacion,
        "descripcionUso": medicamento.descripcion_uso,
        "requiereReceta": medicamento.requiere_receta,
    }
