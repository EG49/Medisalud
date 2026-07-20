from flask import Blueprint, g, request

from app.middleware.auth import requiere_auth
from app.services import medico_service

medico_bp = Blueprint("medico", __name__)


@medico_bp.get("/pacientes")
@requiere_auth("medico")
def buscar_pacientes():
    return medico_service.buscar_pacientes(cedula=request.args.get("cedula"))


@medico_bp.get("/pacientes/<paciente_id>")
@requiere_auth("medico")
def ficha_paciente(paciente_id):
    return medico_service.ficha_paciente(paciente_id)


@medico_bp.post("/recetas")
@requiere_auth("medico")
def crear_receta():
    return medico_service.crear_receta(g.usuario, request.get_json(silent=True) or {}), 201


@medico_bp.post("/recetas/items/<item_id>/suspender")
@requiere_auth("medico")
def suspender_item(item_id):
    return medico_service.suspender_item(g.usuario, item_id)


@medico_bp.post("/examenes")
@requiere_auth("medico")
def crear_examen():
    return medico_service.crear_examen(g.usuario, request.get_json(silent=True) or {}), 201


@medico_bp.post("/historial")
@requiere_auth("medico")
def crear_historial():
    return medico_service.crear_entrada_historial(g.usuario, request.get_json(silent=True) or {}), 201
