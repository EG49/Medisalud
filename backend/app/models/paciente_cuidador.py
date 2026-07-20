import uuid

from app.extensions import db
from app.models.enums import EstadoCuidador, IniciadoPor


class PacienteCuidador(db.Model):
    __tablename__ = "paciente_cuidador"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    paciente_id = db.Column(
        db.String(36), db.ForeignKey("perfil_paciente.usuario_id"), nullable=False
    )
    cuidador_id = db.Column(db.String(36), db.ForeignKey("usuario.id"), nullable=False)
    relacion = db.Column(db.String(50), nullable=True)
    autorizado_pedidos = db.Column(db.Boolean, default=False, nullable=False)
    estado = db.Column(db.Enum(EstadoCuidador), nullable=False)
    iniciado_por = db.Column(db.Enum(IniciadoPor), nullable=False)

    __table_args__ = (
        db.UniqueConstraint("paciente_id", "cuidador_id", name="uq_paciente_cuidador"),
    )
