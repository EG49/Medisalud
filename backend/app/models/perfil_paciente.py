from app.extensions import db


class PerfilPaciente(db.Model):
    __tablename__ = "perfil_paciente"

    usuario_id = db.Column(db.String(36), db.ForeignKey("usuario.id"), primary_key=True)
    fecha_nacimiento = db.Column(db.Date, nullable=True)
    direccion = db.Column(db.String(255), nullable=True)
    contacto_emergencia_nombre = db.Column(db.String(150), nullable=True)
    contacto_emergencia_telefono = db.Column(db.String(20), nullable=True)
    alergias = db.Column(db.Text, nullable=True)

    # Relaciones inversas (1-N) -- ver cada modelo hijo para el backref
    historial_medico = db.relationship("HistorialMedico", backref="paciente", lazy=True)
    examenes = db.relationship("Examen", backref="paciente", lazy=True)
    recetas = db.relationship("Receta", backref="paciente", lazy=True)
    pedidos = db.relationship("Pedido", backref="paciente", lazy=True)
    notificaciones_originadas = db.relationship(
        "Notificacion", backref="paciente_relacionado", lazy=True
    )
