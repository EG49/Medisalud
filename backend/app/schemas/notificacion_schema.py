from app.schemas import iso


def serializar_notificacion(notificacion):
    """Mismo formato que mockNotificaciones.js. El tipo 'recordatorio' nunca
    sale del servidor: esos se generan localmente en el navegador (offline)."""
    return {
        "id": notificacion.id,
        "tipo": notificacion.tipo.value,
        "mensaje": notificacion.mensaje,
        "fecha": iso(notificacion.fecha),
        "leida": notificacion.leida,
    }
