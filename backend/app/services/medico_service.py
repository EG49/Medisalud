from datetime import date, datetime

from app.errors import ApiError
from app.extensions import db
from app.models import (
    Examen,
    HistorialMedico,
    Medicamento,
    Receta,
    RecetaItem,
    Usuario,
)
from app.models.enums import RolUsuario, ZonaCuerpo
from app.schemas import iso, nombre_completo
from app.schemas.examen_schema import serializar_examen
from app.schemas.receta_schema import serializar_receta
from app.services import notificacion_service


def _parsear_fecha(valor, nombre_campo, por_defecto=None):
    if not valor:
        return por_defecto
    try:
        return date.fromisoformat(str(valor)[:10])
    except ValueError:
        raise ApiError(f"El campo {nombre_campo} no tiene un formato válido (AAAA-MM-DD).")


def _paciente_o_error(paciente_id):
    paciente = db.session.get(Usuario, paciente_id) if paciente_id else None
    if not paciente or paciente.perfil_paciente is None:
        raise ApiError("Paciente no encontrado.", 404)
    return paciente


def buscar_pacientes(cedula=None):
    consulta = Usuario.query.filter_by(rol=RolUsuario.paciente)
    if cedula:
        consulta = consulta.filter(Usuario.cedula.like(f"%{cedula.strip()}%"))
    pacientes = [u for u in consulta.all() if u.perfil_paciente is not None]
    return [
        {
            "id": u.id,
            "nombre": nombre_completo(u),
            "cedula": u.cedula,
            "fechaNacimiento": iso(u.perfil_paciente.fecha_nacimiento),
        }
        for u in pacientes
    ]


def ficha_paciente(paciente_id):
    paciente = _paciente_o_error(paciente_id)
    perfil = paciente.perfil_paciente
    return {
        "id": paciente.id,
        "nombre": nombre_completo(paciente),
        "cedula": paciente.cedula,
        "celular": paciente.celular,
        "fechaNacimiento": iso(perfil.fecha_nacimiento),
        "alergias": perfil.alergias,
        "direccion": perfil.direccion,
        "historial": [
            {
                "id": h.id,
                "fecha": iso(h.fecha),
                "diagnostico": h.diagnostico,
                "notas": h.notas,
                "medico": nombre_completo(h.medico.usuario),
            }
            for h in sorted(perfil.historial_medico, key=lambda h: h.fecha, reverse=True)
        ],
        "recetas": [serializar_receta(r) for r in perfil.recetas],
        "examenes": [serializar_examen(e) for e in perfil.examenes],
    }


def crear_receta(medico, datos):
    """body: {pacienteId, hospital?, fechaEmision?, indicacionesExtra?,
              items: [{medicamentoId | medicamento:{nombre,...},
                       cantidadTotal, frecuenciaHoras, duracionDias,
                       fechaInicio?, indicaciones?}]}
    Si un item trae medicamento:{...} en vez de medicamentoId, el medicamento
    se crea en el catálogo (evita tener que precargarlo)."""
    paciente = _paciente_o_error(datos.get("pacienteId"))
    items = datos.get("items") or []
    if not items:
        raise ApiError("La receta necesita al menos un medicamento.")

    receta = Receta(
        paciente_id=paciente.id,
        medico_id=medico.id,
        hospital=(datos.get("hospital") or "").strip() or None,
        fecha_emision=_parsear_fecha(datos.get("fechaEmision"), "fechaEmision", date.today()),
        indicaciones_extra=(datos.get("indicacionesExtra") or "").strip() or None,
    )

    for item in items:
        medicamento = None
        if item.get("medicamentoId"):
            medicamento = db.session.get(Medicamento, item["medicamentoId"])
            if not medicamento:
                raise ApiError("Medicamento no encontrado en el catálogo.", 404)
        elif isinstance(item.get("medicamento"), dict) and item["medicamento"].get("nombre"):
            info = item["medicamento"]
            medicamento = Medicamento(
                nombre=info["nombre"].strip(),
                presentacion=(info.get("presentacion") or "").strip() or None,
                descripcion_uso=(info.get("descripcionUso") or "").strip() or None,
            )
            db.session.add(medicamento)
        else:
            raise ApiError("Cada item necesita medicamentoId o un objeto medicamento con nombre.")

        for campo in ("cantidadTotal", "frecuenciaHoras", "duracionDias"):
            if not isinstance(item.get(campo), int) or item[campo] <= 0:
                raise ApiError(f"El campo {campo} debe ser un entero mayor a 0.")

        fecha_inicio = datetime.utcnow()
        if item.get("fechaInicio"):
            try:
                fecha_inicio = datetime.fromisoformat(str(item["fechaInicio"]).replace("Z", "+00:00"))
            except ValueError:
                raise ApiError("El campo fechaInicio no tiene un formato válido (ISO 8601).")

        receta.items.append(
            RecetaItem(
                medicamento=medicamento,
                cantidad_total=item["cantidadTotal"],
                frecuencia_horas=item["frecuenciaHoras"],
                duracion_dias=item["duracionDias"],
                fecha_inicio=fecha_inicio,
                indicaciones=(item.get("indicaciones") or "").strip() or None,
            )
        )

    db.session.add(receta)
    notificacion_service.notificar(
        paciente.id, "receta", f"{nombre_completo(medico)} te agregó una nueva receta."
    )
    db.session.commit()
    return serializar_receta(receta)


def suspender_item(medico, item_id):
    """Suspende un tratamiento (activa=False). El frontend congela el conteo."""
    item = db.session.get(RecetaItem, item_id)
    if not item or item.receta.medico_id != medico.id:
        raise ApiError("Item de receta no encontrado (o no pertenece a tus recetas).", 404)
    item.activa = False
    db.session.commit()
    return {"mensaje": f"Tratamiento de {item.medicamento.nombre} suspendido."}


def crear_examen(medico, datos):
    paciente = _paciente_o_error(datos.get("pacienteId"))
    if not (datos.get("tipo") or "").strip():
        raise ApiError("Falta el tipo de examen.")
    try:
        zona = ZonaCuerpo(datos.get("zonaCuerpo") or "general")
    except ValueError:
        zonas = ", ".join(z.value for z in ZonaCuerpo)
        raise ApiError(f"zonaCuerpo inválida. Opciones: {zonas}.")

    examen = Examen(
        paciente_id=paciente.id,
        medico_id=medico.id,
        tipo=datos["tipo"].strip(),
        zona_cuerpo=zona,
        fecha=_parsear_fecha(datos.get("fecha"), "fecha", date.today()),
        laboratorio=(datos.get("laboratorio") or "").strip() or None,
        resultado_simple=(datos.get("resultadoSimple") or "").strip() or None,
        archivo_url=(datos.get("archivoUrl") or "").strip() or None,
    )
    db.session.add(examen)
    notificacion_service.notificar(
        paciente.id, "receta", f"{nombre_completo(medico)} subió el resultado de tu {examen.tipo}."
    )
    db.session.commit()
    return serializar_examen(examen)


def crear_entrada_historial(medico, datos):
    paciente = _paciente_o_error(datos.get("pacienteId"))
    entrada = HistorialMedico(
        paciente_id=paciente.id,
        medico_id=medico.id,
        fecha=_parsear_fecha(datos.get("fecha"), "fecha", date.today()),
        diagnostico=(datos.get("diagnostico") or "").strip() or None,
        notas=(datos.get("notas") or "").strip() or None,
    )
    db.session.add(entrada)
    db.session.commit()
    return {
        "id": entrada.id,
        "fecha": iso(entrada.fecha),
        "diagnostico": entrada.diagnostico,
        "notas": entrada.notas,
    }
