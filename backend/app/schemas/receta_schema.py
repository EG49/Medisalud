from app.schemas import iso
from app.schemas.usuario_schema import serializar_medico_resumen


def serializar_receta_item(item):
    med = item.medicamento
    return {
        "id": item.id,
        "medicamento": {
            "nombre": med.nombre,
            "presentacion": med.presentacion,
            "descripcionUso": med.descripcion_uso,
        },
        "cantidadTotal": item.cantidad_total,
        "frecuenciaHoras": item.frecuencia_horas,
        "duracionDias": item.duracion_dias,
        "fechaInicio": iso(item.fecha_inicio),
        "indicaciones": item.indicaciones,
        "activa": item.activa,
    }


def serializar_receta(receta):
    """Mismo formato que mockRecetas.js: la receta es un documento (una visita)
    con uno o más items de medicamento."""
    return {
        "id": receta.id,
        "medico": serializar_medico_resumen(receta.medico),
        "hospital": receta.hospital,
        "fechaEmision": iso(receta.fecha_emision),
        "indicacionesExtra": receta.indicaciones_extra,
        "items": [serializar_receta_item(i) for i in receta.items],
    }
