import uuid

from app.extensions import db


class Farmacia(db.Model):
    __tablename__ = "farmacia"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre = db.Column(db.String(150), nullable=False)
    logo_url = db.Column(db.String(255), nullable=True)
    direccion = db.Column(db.String(255), nullable=True)
    telefono_contacto = db.Column(db.String(20), nullable=True)

    pedido_detalles = db.relationship("PedidoDetalle", backref="farmacia", lazy=True)
