import uuid
from datetime import datetime

from app.extensions import db
from app.models.enums import TipoNotificacion


class Notificacion(db.Model):
    __tablename__ = "notificacion"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    # A quién le llega (puede ser el paciente o su cuidador -- se le manda copia)
    destinatario_id = db.Column(db.String(36), db.ForeignKey("usuario.id"), nullable=False)
    # De qué paciente es originalmente, para que el cuidador sepa "esto es de quién"
    paciente_relacionado_id = db.Column(
        db.String(36), db.ForeignKey("perfil_paciente.usuario_id"), nullable=False
    )
    tipo = db.Column(db.Enum(TipoNotificacion), nullable=False)
    mensaje = db.Column(db.String(255), nullable=False)
    leida = db.Column(db.Boolean, default=False, nullable=False)
    fecha = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    destinatario = db.relationship("Usuario", foreign_keys=[destinatario_id])

    # NOTA: tipo 'recordatorio' NO existe aquí a propósito -- esos viven solo
    # en IndexedDB del navegador (frontend/src/offline/notifications/). Ver
    # decisión en docs/diagrama-er.md.
