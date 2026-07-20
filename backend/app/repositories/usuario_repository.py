from app.extensions import db
from app.models import Usuario, PerfilPaciente, PerfilMedico, PerfilRepartidor
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
    db.session.flush()

    perfil = PerfilPaciente(usuario_id=usuario.id, fecha_nacimiento=fecha_nacimiento)
    db.session.add(perfil)

    db.session.commit()
    return usuario


def crear_medico(nombre, apellidos, cedula, celular, especialidad, num_licencia):
    usuario = Usuario(
        nombre=nombre,
        apellidos=apellidos,
        cedula=cedula,
        celular=celular,
        rol=RolUsuario.medico,
    )
    db.session.add(usuario)
    db.session.flush()

    perfil = PerfilMedico(
        usuario_id=usuario.id, especialidad=especialidad, num_licencia=num_licencia
    )
    db.session.add(perfil)

    db.session.commit()
    return usuario


def crear_repartidor(nombre, apellidos, cedula, celular, vehiculo, zona_cobertura):
    usuario = Usuario(
        nombre=nombre,
        apellidos=apellidos,
        cedula=cedula,
        celular=celular,
        rol=RolUsuario.repartidor,
    )
    db.session.add(usuario)
    db.session.flush()

    perfil = PerfilRepartidor(
        usuario_id=usuario.id, vehiculo=vehiculo, zona_cobertura=zona_cobertura
    )
    db.session.add(perfil)

    db.session.commit()
    return usuario
