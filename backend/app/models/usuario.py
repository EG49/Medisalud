import uuid
from datetime import datetime

from app.extensions import db
from app.models.enums import RolUsuario


class Usuario(db.Model):
    __tablename__ = "usuario"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre = db.Column(db.String(100), nullable=False)
    apellidos = db.Column(db.String(100), nullable=False)
    cedula = db.Column(db.String(20), unique=True, nullable=False)
    celular = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=True)
    rol = db.Column(db.Enum(RolUsuario), nullable=False)
    activo = db.Column(db.Boolean, default=True, nullable=False)
    creado_en = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # 1-1 con cada perfil según el rol (solo uno de estos existirá por usuario)
    perfil_paciente = db.relationship(
        "PerfilPaciente", backref="usuario", uselist=False, cascade="all, delete-orphan"
    )
    perfil_medico = db.relationship(
        "PerfilMedico", backref="usuario", uselist=False, cascade="all, delete-orphan"
    )
    perfil_repartidor = db.relationship(
        "PerfilRepartidor", backref="usuario", uselist=False, cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Usuario {self.nombre} {self.apellidos} ({self.rol.value})>"
