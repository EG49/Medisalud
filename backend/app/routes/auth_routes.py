from datetime import datetime

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
    campos_requeridos = ["nombre", "apellidos", "cedula", "celular", "fecha_nacimiento"]
    faltantes = [campo for campo in campos_requeridos if not data.get(campo)]
    if faltantes:
        return jsonify({"message": f"Faltan campos: {', '.join(faltantes)}"}), 400

    try:
        fecha_nacimiento = datetime.strptime(data["fecha_nacimiento"], "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"message": "fecha_nacimiento debe tener formato YYYY-MM-DD."}), 400

    try:
        usuario = auth_service.registrar(
            nombre=data["nombre"],
            apellidos=data["apellidos"],
            cedula=data["cedula"],
            celular=data["celular"],
            fecha_nacimiento=fecha_nacimiento,
        )
    except auth_service.AuthError as error:
        return jsonify({"message": str(error)}), 400

    return jsonify(usuario_a_dict(usuario)), 201
