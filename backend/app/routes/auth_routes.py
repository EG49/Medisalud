from flask import Blueprint, jsonify, request

from app.services import auth_service
from app.schemas.usuario_schema import usuario_a_dict

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/enviar-codigo")
def enviar_codigo():
    data = request.get_json(silent=True) or {}
    cedula = data.get("cedula")
    celular = data.get("celular")

    if not cedula or not celular:
        return jsonify({"message": "Cédula y celular son obligatorios."}), 400

    resultado = auth_service.solicitar_codigo(cedula, celular)
    return jsonify(resultado), 200


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    cedula = data.get("cedula")
    celular = data.get("celular")
    codigo = data.get("codigo")

    if not cedula or not celular or not codigo:
        return jsonify({"message": "Cédula, celular y código son obligatorios."}), 400

    try:
        usuario = auth_service.login(cedula, celular, codigo)
    except auth_service.AuthError as error:
        return jsonify({"message": str(error)}), 400

    return jsonify(usuario_a_dict(usuario)), 200


@auth_bp.post("/registro")
def registro():
    data = request.get_json(silent=True) or {}
    rol = data.get("rol", "paciente")  # el registro de paciente sigue siendo el default

    if not data.get("cedula") or not data.get("celular"):
        return jsonify({"message": "Cédula y celular son obligatorios."}), 400

    try:
        usuario = auth_service.registrar(rol, data)
    except auth_service.AuthError as error:
        return jsonify({"message": str(error)}), 400

    return jsonify(usuario_a_dict(usuario)), 201
