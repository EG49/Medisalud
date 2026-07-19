import enum


class RolUsuario(enum.Enum):
    paciente = "paciente"
    medico = "medico"
    repartidor = "repartidor"
    cuidador = "cuidador"
    admin = "admin"


class EstadoCuidador(enum.Enum):
    pendiente_solicitud = "pendiente_solicitud"  # el cuidador pidió acceso
    pendiente_invitacion = "pendiente_invitacion"  # el paciente invitó
    aprobado = "aprobado"


class IniciadoPor(enum.Enum):
    paciente = "paciente"
    cuidador = "cuidador"


class ZonaCuerpo(enum.Enum):
    cabeza = "cabeza"
    torax = "torax"
    abdomen = "abdomen"
    brazo_izq = "brazo_izq"
    brazo_der = "brazo_der"
    pierna_izq = "pierna_izq"
    pierna_der = "pierna_der"
    general = "general"


class EstadoPedido(enum.Enum):
    solicitado = "solicitado"
    confirmado = "confirmado"
    en_preparacion = "en_preparacion"
    en_camino = "en_camino"
    entregado = "entregado"
    cancelado = "cancelado"


class TipoNotificacion(enum.Enum):
    pedido = "pedido"
    receta = "receta"
    cuidador = "cuidador"
