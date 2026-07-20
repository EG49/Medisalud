from app.schemas import nombre_completo


def serializar_vinculado(vinculo, usuario_cuidador):
    """Mismo formato que mockCuidadoresVinculados (mockCuidadores.js)."""
    return {
        "id": vinculo.id,
        "nombre": nombre_completo(usuario_cuidador),
        "relacion": vinculo.relacion,
        "autorizadoPedidos": vinculo.autorizado_pedidos,
    }


def serializar_solicitud_recibida(vinculo, usuario_cuidador):
    """El cuidador pidió acceso — el paciente aprueba/rechaza."""
    return {
        "id": vinculo.id,
        "nombre": nombre_completo(usuario_cuidador),
        "relacion": vinculo.relacion,
    }


def serializar_invitacion_enviada(vinculo, usuario_cuidador):
    """El paciente invitó — pendiente hasta que el cuidador acepte.
    (El modelo no guarda fecha de invitación, por eso va en null)."""
    return {
        "id": vinculo.id,
        "destinatario": usuario_cuidador.celular,
        "fecha": None,
    }
