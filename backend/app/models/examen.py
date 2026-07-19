import uuid

from app.extensions import db
from app.models.enums import ZonaCuerpo


class Examen(db.Model):
    __tablename__ = "examen"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    paciente_id = db.Column(
        db.String(36), db.ForeignKey("perfil_paciente.usuario_id"), nullable=False
    )
    medico_id = db.Column(
        db.String(36), db.ForeignKey("perfil_medico.usuario_id"), nullable=False
    )
    tipo = db.Column(db.String(150), nullable=False)
    zona_cuerpo = db.Column(db.Enum(ZonaCuerpo), nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    laboratorio = db.Column(db.String(150), nullable=True)
    # Resultado en lenguaje NO técnico -- lo escribe el médico manualmente,
    # nunca se genera automáticamente (ver decisión de seguridad clínica).
    resultado_simple = db.Column(db.Text, nullable=True)
    archivo_url = db.Column(db.String(255), nullable=True)
