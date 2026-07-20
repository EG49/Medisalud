"""Serializadores: convierten modelos SQLAlchemy al JSON camelCase que el
frontend ya espera (los formatos están definidos por los mocks de
frontend/src/features/paciente/mock*.js — NO cambiar las claves aquí sin
cambiar también el frontend)."""

from datetime import date, datetime


def iso(valor):
    """Fecha/datetime → string ISO (o None)."""
    if valor is None:
        return None
    if isinstance(valor, datetime):
        return valor.isoformat() + ("Z" if valor.tzinfo is None else "")
    if isinstance(valor, date):
        return valor.isoformat()
    return valor


def nombre_completo(usuario):
    return f"{usuario.nombre} {usuario.apellidos}"
