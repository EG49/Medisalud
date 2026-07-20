"""Vínculo paciente-cuidador. La invitación va en ambos sentidos:
- el paciente invita por celular  -> estado pendiente_invitacion
- el cuidador solicita por cédula -> estado pendiente_solicitud
El otro lado aprueba o rechaza."""

from app.errors import ApiError
from app.extensions import db
from app.models import PacienteCuidador, Usuario
from app.models.enums import EstadoCuidador, IniciadoPor
from app.schemas import nombre_completo
from app.schemas.cuidador_schema import (
    serializar_invitacion_enviada,
    serializar_solicitud_recibida,
    serializar_vinculado,
)
from app.services import notificacion_service


def _usuario_de(vinculo):
    return db.session.get(Usuario, vinculo.cuidador_id)


def listar_para_paciente(paciente_id):
    """Devuelve las tres listas que consume CuidadoresSection (mockCuidadores.js)."""
    vinculos = PacienteCuidador.query.filter_by(paciente_id=paciente_id).all()
    resultado = {"vinculados": [], "solicitudesRecibidas": [], "invitacionesEnviadas": []}
    for v in vinculos:
        cuidador = _usuario_de(v)
        if v.estado == EstadoCuidador.aprobado:
            resultado["vinculados"].append(serializar_vinculado(v, cuidador))
        elif v.estado == EstadoCuidador.pendiente_solicitud:
            resultado["solicitudesRecibidas"].append(serializar_solicitud_recibida(v, cuidador))
        elif v.estado == EstadoCuidador.pendiente_invitacion:
            resultado["invitacionesEnviadas"].append(serializar_invitacion_enviada(v, cuidador))
    return resultado


def invitar(paciente, datos):
    celular = (datos.get("celular") or "").strip()
    if not celular:
        raise ApiError("Falta el celular de la persona que quieres invitar.")

    invitado = Usuario.query.filter_by(celular=celular).first()
    if not invitado:
        raise ApiError("Esa persona todavía no tiene cuenta en MediSalud; pídele que se registre primero.", 404)
    if invitado.id == paciente.id:
        raise ApiError("No puedes invitarte a ti mismo.")

    existente = PacienteCuidador.query.filter_by(
        paciente_id=paciente.id, cuidador_id=invitado.id
    ).first()
    if existente:
        raise ApiError("Ya existe una invitación o vínculo con esa persona.", 409)

    vinculo = PacienteCuidador(
        paciente_id=paciente.id,
        cuidador_id=invitado.id,
        relacion=(datos.get("relacion") or "").strip() or None,
        estado=EstadoCuidador.pendiente_invitacion,
        iniciado_por=IniciadoPor.paciente,
    )
    db.session.add(vinculo)
    db.session.commit()
    return serializar_invitacion_enviada(vinculo, invitado)


def responder_solicitud(paciente, vinculo_id, aprobar):
    """El paciente aprueba/rechaza una solicitud que le hizo un cuidador."""
    vinculo = db.session.get(PacienteCuidador, vinculo_id)
    if not vinculo or vinculo.paciente_id != paciente.id:
        raise ApiError("Solicitud no encontrada.", 404)
    if vinculo.estado != EstadoCuidador.pendiente_solicitud:
        raise ApiError("Esta solicitud ya fue respondida.", 409)

    if aprobar:
        vinculo.estado = EstadoCuidador.aprobado
        notificacion_service.notificar(
            paciente.id,
            "cuidador",
            f"{nombre_completo(_usuario_de(vinculo))} ahora es tu cuidador.",
            incluir_cuidadores=False,
        )
        db.session.commit()
        return serializar_vinculado(vinculo, _usuario_de(vinculo))

    db.session.delete(vinculo)
    db.session.commit()
    return {"mensaje": "Solicitud rechazada."}


def actualizar_autorizacion(paciente_id, vinculo_id, autorizado):
    vinculo = db.session.get(PacienteCuidador, vinculo_id)
    if not vinculo or vinculo.paciente_id != paciente_id:
        raise ApiError("Cuidador no encontrado.", 404)
    if vinculo.estado != EstadoCuidador.aprobado:
        raise ApiError("Ese vínculo todavía no está aprobado.", 409)
    vinculo.autorizado_pedidos = bool(autorizado)
    db.session.commit()
    return serializar_vinculado(vinculo, _usuario_de(vinculo))


def eliminar_vinculo(paciente_id, vinculo_id):
    """Sirve para desvincular un cuidador aprobado o retirar una invitación."""
    vinculo = db.session.get(PacienteCuidador, vinculo_id)
    if not vinculo or vinculo.paciente_id != paciente_id:
        raise ApiError("Cuidador no encontrado.", 404)
    db.session.delete(vinculo)
    db.session.commit()
    return {"mensaje": "Vínculo eliminado."}


# ---- Lado del cuidador ----

def solicitar_acceso(cuidador, datos):
    """Un usuario pide ser cuidador de un paciente, identificándolo por cédula."""
    cedula = (datos.get("cedulaPaciente") or "").strip()
    if not cedula:
        raise ApiError("Falta la cédula del paciente.")

    paciente = Usuario.query.filter_by(cedula=cedula).first()
    if not paciente or paciente.perfil_paciente is None:
        raise ApiError("No encontramos un paciente con esa cédula.", 404)
    if paciente.id == cuidador.id:
        raise ApiError("No puedes ser tu propio cuidador.")

    existente = PacienteCuidador.query.filter_by(
        paciente_id=paciente.id, cuidador_id=cuidador.id
    ).first()
    if existente:
        raise ApiError("Ya existe una invitación o vínculo con ese paciente.", 409)

    vinculo = PacienteCuidador(
        paciente_id=paciente.id,
        cuidador_id=cuidador.id,
        relacion=(datos.get("relacion") or "").strip() or None,
        estado=EstadoCuidador.pendiente_solicitud,
        iniciado_por=IniciadoPor.cuidador,
    )
    db.session.add(vinculo)
    db.session.commit()
    return {"mensaje": "Solicitud enviada. El paciente debe aprobarla."}


def listar_invitaciones_del_cuidador(cuidador_id):
    """Invitaciones que pacientes le enviaron a este usuario."""
    vinculos = PacienteCuidador.query.filter_by(
        cuidador_id=cuidador_id, estado=EstadoCuidador.pendiente_invitacion
    ).all()
    resultado = []
    for v in vinculos:
        paciente = db.session.get(Usuario, v.paciente_id)
        resultado.append({"id": v.id, "paciente": nombre_completo(paciente), "relacion": v.relacion})
    return resultado


def responder_invitacion(cuidador, vinculo_id, aceptar):
    vinculo = db.session.get(PacienteCuidador, vinculo_id)
    if not vinculo or vinculo.cuidador_id != cuidador.id:
        raise ApiError("Invitación no encontrada.", 404)
    if vinculo.estado != EstadoCuidador.pendiente_invitacion:
        raise ApiError("Esta invitación ya fue respondida.", 409)

    if aceptar:
        vinculo.estado = EstadoCuidador.aprobado
        notificacion_service.notificar(
            vinculo.paciente_id,
            "cuidador",
            f"{nombre_completo(cuidador)} aceptó tu invitación de cuidador.",
            incluir_cuidadores=False,
        )
        db.session.commit()
        return {"mensaje": "Ahora eres cuidador de este paciente."}

    db.session.delete(vinculo)
    db.session.commit()
    return {"mensaje": "Invitación rechazada."}
