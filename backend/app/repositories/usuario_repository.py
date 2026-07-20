from app.extensions import db
from app.models import Usuario, PerfilPaciente
from app.models.enums import RolUsuario


def buscar_por_cedula_y_celular(cedula, celular):
    return Usuario.query.filter_by(cedula=cedula, celular=celular).first()


def buscar_por_cedula(cedula):
    return Usuario.query.filter_by(cedula=cedula).first()


def buscar_por_celular(celular):
    return Usuario.query.filter_by(celular=celular).first()


def crear_paciente(nombre, apellidos, cedula, celular, fecha_nacimiento):
    usuario = Usuario(
        nombre=nombre,
        apellidos=apellidos,
        cedula=cedula,
        celular=celular,
        rol=RolUsuario.paciente,
    )
    db.session.add(usuario)
    db.session.flush()  # asigna el id sin cerrar la transacción todavía

    perfil = PerfilPaciente(usuario_id=usuario.id, fecha_nacimiento=fecha_nacimiento)
    db.session.add(perfil)

    db.session.commit()
    return usuario
