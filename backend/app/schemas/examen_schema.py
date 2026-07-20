from app.schemas import iso, nombre_completo


def serializar_examen(examen):
    """Mismo formato que mockExamenes.js."""
    return {
        "id": examen.id,
        "tipo": examen.tipo,
        "zonaCuerpo": examen.zona_cuerpo.value,
        "fecha": iso(examen.fecha),
        "laboratorio": examen.laboratorio,
        "medico": {"nombre": nombre_completo(examen.medico.usuario)},
        "resultadoSimple": examen.resultado_simple,
        "archivoUrl": examen.archivo_url,
    }
