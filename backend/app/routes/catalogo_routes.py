"""Catálogos compartidos: farmacias (para armar pedidos) y medicamentos
(para que el médico busque al recetar). Cualquier rol autenticado puede leer."""

from flask import Blueprint, request

from app.middleware.auth import requiere_auth
from app.models import Farmacia, Medicamento
from app.schemas.catalogo_schema import serializar_farmacia, serializar_medicamento

catalogo_bp = Blueprint("catalogo", __name__)


@catalogo_bp.get("/farmacias")
@requiere_auth()
def listar_farmacias():
    return [serializar_farmacia(f) for f in Farmacia.query.order_by(Farmacia.nombre).all()]


@catalogo_bp.get("/medicamentos")
@requiere_auth()
def listar_medicamentos():
    consulta = Medicamento.query
    buscar = (request.args.get("buscar") or "").strip()
    if buscar:
        consulta = consulta.filter(Medicamento.nombre.ilike(f"%{buscar}%"))
    return [serializar_medicamento(m) for m in consulta.order_by(Medicamento.nombre).all()]
