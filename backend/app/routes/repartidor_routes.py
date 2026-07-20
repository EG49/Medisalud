from flask import Blueprint, g, request

from app.middleware.auth import requiere_auth
from app.services import repartidor_service

repartidor_bp = Blueprint("repartidor", __name__)


@repartidor_bp.get("/pedidos")
@requiere_auth("repartidor")
def listar_pedidos():
    return repartidor_service.listar_pedidos(g.usuario.id)


@repartidor_bp.post("/pedidos/<pedido_id>/tomar")
@requiere_auth("repartidor")
def tomar_pedido(pedido_id):
    return repartidor_service.tomar_pedido(g.usuario.id, pedido_id)


@repartidor_bp.post("/pedidos/<pedido_id>/estado")
@requiere_auth("repartidor")
def cambiar_estado(pedido_id):
    datos = request.get_json(silent=True) or {}
    return repartidor_service.cambiar_estado(g.usuario.id, pedido_id, datos.get("estado"))
