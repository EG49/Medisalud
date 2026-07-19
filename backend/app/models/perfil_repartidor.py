from app.extensions import db


class PerfilRepartidor(db.Model):
    __tablename__ = "perfil_repartidor"

    usuario_id = db.Column(db.String(36), db.ForeignKey("usuario.id"), primary_key=True)
    vehiculo = db.Column(db.String(100), nullable=True)
    zona_cobertura = db.Column(db.String(150), nullable=True)

    pedidos_asignados = db.relationship("Pedido", backref="repartidor", lazy=True)
