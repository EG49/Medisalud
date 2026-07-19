import uuid

from app.extensions import db


class Medicamento(db.Model):
    __tablename__ = "medicamento"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre = db.Column(db.String(150), nullable=False)
    presentacion = db.Column(db.String(150), nullable=True)
    descripcion_uso = db.Column(db.Text, nullable=True)
    requiere_receta = db.Column(db.Boolean, default=True, nullable=False)

    items_receta = db.relationship("RecetaItem", backref="medicamento", lazy=True)
