from app.extensions import db


class PerfilMedico(db.Model):
    __tablename__ = "perfil_medico"

    usuario_id = db.Column(db.String(36), db.ForeignKey("usuario.id"), primary_key=True)
    especialidad = db.Column(db.String(100), nullable=True)
    num_licencia = db.Column(db.String(50), nullable=True)

    historial_medico = db.relationship("HistorialMedico", backref="medico", lazy=True)
    examenes = db.relationship("Examen", backref="medico", lazy=True)
    recetas = db.relationship("Receta", backref="medico", lazy=True)
