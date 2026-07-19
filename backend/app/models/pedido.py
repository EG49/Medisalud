import uuid
from datetime import datetime

from app.extensions import db
from app.models.enums import EstadoPedido


class Pedido(db.Model):
    __tablename__ = "pedido"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    paciente_id = db.Column(
        db.String(36), db.ForeignKey("perfil_paciente.usuario_id"), nullable=False
    )
    cuidador_id = db.Column(db.String(36), db.ForeignKey("usuario.id"), nullable=True)
    repartidor_id = db.Column(
        db.String(36), db.ForeignKey("perfil_repartidor.usuario_id"), nullable=True
    )
    direccion_entrega = db.Column(db.String(255), nullable=False)
    estado = db.Column(
        db.Enum(EstadoPedido), nullable=False, default=EstadoPedido.solicitado
    )
    creado_en = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    entregado_en = db.Column(db.DateTime, nullable=True)

    detalles = db.relationship(
        "PedidoDetalle", backref="pedido", lazy=True, cascade="all, delete-orphan"
    )
