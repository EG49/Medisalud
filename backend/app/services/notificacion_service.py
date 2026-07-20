from app.errors import ApiError
from app.extensions import db
from app.models import Notificacion, PacienteCuidador
from app.models.enums import EstadoCuidador, TipoNotificacion
from app.schemas.notificacion_schema import serializar_notificacion


def listar(usuario):
    notificaciones = (
        Notificacion.query.filter_by(destinatario_id=usuario.id)
        .order_by(Notificacion.fecha.desc())
        .all()
    )
    return [serializar_notificacion(n) for n in notificaciones]


def marcar_leida(usuario, notificacion_id):
    notificacion = db.session.get(Notificacion, notificacion_id)
    if not notificacion or notificacion.destinatario_id != usuario.id:
        raise ApiError("Notificación no encontrada.", 404)
    notificacion.leida = True
    db.session.commit()
    return serializar_notificacion(notificacion)


def marcar_todas_leidas(usuario):
    Notificacion.query.filter_by(destinatario_id=usuario.id, leida=False).update({"leida": True})
    db.session.commit()
    return {"mensaje": "Todas las notificaciones quedaron marcadas como leídas."}


def notificar(paciente_id, tipo, mensaje, incluir_cuidadores=True):
    """Crea la notificación para el paciente y copia a sus cuidadores
    aprobados (así el cuidador se entera de pedidos/recetas del paciente).
    NO hace commit — se comparte la transacción del service que la llama."""
    db.session.add(
        Notificacion(
            destinatario_id=paciente_id,
            paciente_relacionado_id=paciente_id,
            tipo=TipoNotificacion(tipo),
            mensaje=mensaje,
        )
    )
    if incluir_cuidadores:
        vinculos = PacienteCuidador.query.filter_by(
            paciente_id=paciente_id, estado=EstadoCuidador.aprobado
        ).all()
        for vinculo in vinculos:
            db.session.add(
                Notificacion(
                    destinatario_id=vinculo.cuidador_id,
                    paciente_relacionado_id=paciente_id,
                    tipo=TipoNotificacion(tipo),
                    mensaje=mensaje,
                )
            )
