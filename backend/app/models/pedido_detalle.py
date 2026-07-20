import uuid

from app.extensions import db


class PedidoDetalle(db.Model):
    __tablename__ = "pedido_detalle"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    pedido_id = db.Column(db.String(36), db.ForeignKey("pedido.id"), nullable=False)
    receta_item_id = db.Column(db.String(36), db.ForeignKey("receta_item.id"), nullable=False)
    farmacia_id = db.Column(db.String(36), db.ForeignKey("farmacia.id"), nullable=False)
    cantidad_solicitada = db.Column(db.Integer, nullable=False)
