import uuid

from app.extensions import db


class HistorialMedico(db.Model):
    __tablename__ = "historial_medico"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    paciente_id = db.Column(
        db.String(36), db.ForeignKey("perfil_paciente.usuario_id"), nullable=False
    )
    medico_id = db.Column(
        db.String(36), db.ForeignKey("perfil_medico.usuario_id"), nullable=False
    )
    fecha = db.Column(db.Date, nullable=False)
    diagnostico = db.Column(db.Text, nullable=True)
    notas = db.Column(db.Text, nullable=True)
