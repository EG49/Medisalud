import uuid

from app.extensions import db


class RecetaItem(db.Model):
    __tablename__ = "receta_item"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    receta_id = db.Column(db.String(36), db.ForeignKey("receta.id"), nullable=False)
    medicamento_id = db.Column(db.String(36), db.ForeignKey("medicamento.id"), nullable=False)
    cantidad_total = db.Column(db.Integer, nullable=False)
    frecuencia_horas = db.Column(db.Integer, nullable=False)
    duracion_dias = db.Column(db.Integer, nullable=False)
    fecha_inicio = db.Column(db.DateTime, nullable=False)
    indicaciones = db.Column(db.Text, nullable=True)
    activa = db.Column(db.Boolean, default=True, nullable=False)

    pedido_detalles = db.relationship("PedidoDetalle", backref="receta_item", lazy=True)

    # NOTA: la "medicina disponible" NUNCA es una columna -- se calcula en el
    # cliente (features/paciente/medicineAvailability.js) a partir de
    # cantidad_total, frecuencia_horas y fecha_inicio. No dupliques ese cálculo
    # como campo aquí, o vas a tener dos fuentes de verdad desincronizadas.
