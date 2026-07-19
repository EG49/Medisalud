import uuid

from app.extensions import db


class Receta(db.Model):
    __tablename__ = "receta"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    paciente_id = db.Column(
        db.String(36), db.ForeignKey("perfil_paciente.usuario_id"), nullable=False
    )
    medico_id = db.Column(
        db.String(36), db.ForeignKey("perfil_medico.usuario_id"), nullable=False
    )
    hospital = db.Column(db.String(150), nullable=True)
    fecha_emision = db.Column(db.Date, nullable=False)
    indicaciones_extra = db.Column(db.Text, nullable=True)

    items = db.relationship(
        "RecetaItem", backref="receta", lazy=True, cascade="all, delete-orphan"
    )
