from app.schemas import iso, nombre_completo


def _serializar_item(detalle):
    return {
        "id": detalle.id,
        "medicamentoNombre": detalle.receta_item.medicamento.nombre,
        "cantidadSolicitada": detalle.cantidad_solicitada,
        "farmacia": {"nombre": detalle.farmacia.nombre},
    }


def serializar_pedido_activo(pedido):
    """Mismo formato que mockPedidoActivo (mockPedidos.js)."""
    repartidor = pedido.repartidor
    return {
        "id": pedido.id,
        "estado": pedido.estado.value,
        "direccionEntrega": pedido.direccion_entrega,
        "repartidor": {"nombre": nombre_completo(repartidor.usuario)} if repartidor else None,
        "actualizadoEn": iso(pedido.entregado_en or pedido.creado_en),
        "items": [_serializar_item(d) for d in pedido.detalles],
    }


def serializar_pedido_historial(pedido):
    """Mismo formato que mockHistorialPedidos (mockPedidos.js)."""
    return {
        "id": pedido.id,
        "estado": pedido.estado.value,
        "fecha": iso(pedido.entregado_en or pedido.creado_en),
        "items": [
            {
                "id": d.id,
                "medicamentoNombre": d.receta_item.medicamento.nombre,
                "farmacia": {"nombre": d.farmacia.nombre},
            }
            for d in pedido.detalles
        ],
    }
