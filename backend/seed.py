"""Datos de ejemplo para desarrollo — replica los mocks del frontend
(frontend/src/features/paciente/mock*.js) para que el dashboard se vea igual
al conectarlo al backend real.

Uso (con el venv activo y la base creada):
    python seed.py          # borra TODO y recarga los datos de ejemplo
"""

from datetime import date, datetime, timedelta

from dotenv import load_dotenv

load_dotenv()

from app import create_app  # noqa: E402
from app.extensions import db  # noqa: E402
from app.models import (  # noqa: E402
    Examen,
    Farmacia,
    Medicamento,
    Notificacion,
    PacienteCuidador,
    Pedido,
    PedidoDetalle,
    PerfilMedico,
    PerfilPaciente,
    PerfilRepartidor,
    Receta,
    RecetaItem,
    Usuario,
)
from app.models.enums import (  # noqa: E402
    EstadoCuidador,
    EstadoPedido,
    IniciadoPor,
    RolUsuario,
    TipoNotificacion,
    ZonaCuerpo,
)


def hace(dias=0, horas=0, minutos=0):
    return datetime.utcnow() - timedelta(days=dias, hours=horas, minutes=minutos)


def crear_datos():
    # ---- Usuarios ----
    maria = Usuario(
        nombre="María", apellidos="Fernández", cedula="0912345678",
        celular="0991234567", rol=RolUsuario.paciente,
        perfil_paciente=PerfilPaciente(
            fecha_nacimiento=date(1954, 3, 12),
            direccion="Av. Francisco de Orellana, Guayaquil",
            contacto_emergencia_nombre="Ana Fernández",
            contacto_emergencia_telefono="0987654321",
            alergias="Penicilina",
        ),
    )
    andrade = Usuario(
        nombre="Carlos", apellidos="Andrade", cedula="0901111111",
        celular="0990000001", rol=RolUsuario.medico,
        perfil_medico=PerfilMedico(especialidad="Medicina General", num_licencia="MED-1001"),
    )
    rios = Usuario(
        nombre="Elena", apellidos="Ríos", cedula="0902222222",
        celular="0990000002", rol=RolUsuario.medico,
        perfil_medico=PerfilMedico(especialidad="Cardiología", num_licencia="MED-1002"),
    )
    mera = Usuario(
        nombre="Sofía", apellidos="Mera", cedula="0903333333",
        celular="0990000003", rol=RolUsuario.medico,
        perfil_medico=PerfilMedico(especialidad="Medicina Interna", num_licencia="MED-1003"),
    )
    juan = Usuario(
        nombre="Juan", apellidos="Pérez", cedula="0904444444",
        celular="0990000004", rol=RolUsuario.repartidor,
        perfil_repartidor=PerfilRepartidor(vehiculo="Moto", zona_cobertura="Guayaquil Norte"),
    )
    ana = Usuario(
        nombre="Ana", apellidos="Fernández", cedula="0905555555",
        celular="0998887771", rol=RolUsuario.cuidador,
    )
    pedro = Usuario(
        nombre="Pedro", apellidos="Fernández", cedula="0906666666",
        celular="0998887772", rol=RolUsuario.cuidador,
    )
    db.session.add_all([maria, andrade, rios, mera, juan, ana, pedro])
    db.session.flush()

    # ---- Cuidadores de María (como mockCuidadores.js) ----
    db.session.add_all([
        PacienteCuidador(
            paciente_id=maria.id, cuidador_id=ana.id, relacion="Hija",
            autorizado_pedidos=True, estado=EstadoCuidador.aprobado,
            iniciado_por=IniciadoPor.paciente,
        ),
        PacienteCuidador(
            paciente_id=maria.id, cuidador_id=pedro.id, relacion="Hijo",
            estado=EstadoCuidador.pendiente_solicitud, iniciado_por=IniciadoPor.cuidador,
        ),
    ])

    # ---- Farmacias y medicamentos ----
    fybeca = Farmacia(nombre="Fybeca", direccion="C.C. San Marino, Guayaquil", telefono_contacto="042000001")
    cruz_azul = Farmacia(nombre="Farmacias Cruz Azul", direccion="Av. 9 de Octubre, Guayaquil", telefono_contacto="042000002")

    paracetamol = Medicamento(nombre="Paracetamol", presentacion="Tableta 500mg",
                              descripcion_uso="Alivia el dolor leve a moderado y baja la fiebre.")
    losartan = Medicamento(nombre="Losartán", presentacion="Tableta 50mg",
                           descripcion_uso="Controla la presión arterial alta.")
    metformina = Medicamento(nombre="Metformina", presentacion="Tableta 850mg",
                             descripcion_uso="Ayuda a controlar el nivel de azúcar en la sangre.")
    amoxicilina = Medicamento(nombre="Amoxicilina", presentacion="Cápsula 500mg",
                              descripcion_uso="Antibiótico para tratar infecciones bacterianas.")
    db.session.add_all([fybeca, cruz_azul, paracetamol, losartan, metformina, amoxicilina])
    db.session.flush()

    # ---- Recetas (como mockRecetas.js: un documento por visita) ----
    def receta(medico, hospital, dias_atras, indicaciones_extra, items):
        r = Receta(
            paciente_id=maria.id, medico_id=medico.id, hospital=hospital,
            fecha_emision=(datetime.utcnow() - timedelta(days=dias_atras)).date(),
            indicaciones_extra=indicaciones_extra,
        )
        for med, cantidad, frec, dur, dias_inicio, indic, activa in items:
            r.items.append(RecetaItem(
                medicamento_id=med.id, cantidad_total=cantidad, frecuencia_horas=frec,
                duracion_dias=dur, fecha_inicio=hace(dias=dias_inicio),
                indicaciones=indic, activa=activa,
            ))
        db.session.add(r)
        return r

    r1 = receta(andrade, "Hospital Clínica Kennedy", 3,
                "Reposo relativo. Volver a consulta si la fiebre persiste más de 48 horas.",
                [(paracetamol, 10, 12, 5, 3, "Tomar con alimentos.", True)])
    receta(rios, "Hospital Luis Vernaza", 10,
           "Control de presión arterial en casa 2 veces por semana. Próxima cita en 30 días.",
           [(losartan, 30, 24, 30, 10, "Tomar siempre a la misma hora, en ayunas.", True)])
    r3 = receta(andrade, "Hospital Clínica Kennedy", 9,
                "Traer resultados de glucosa en ayunas en la próxima cita.",
                [(metformina, 20, 12, 10, 9, "Tomar después de las comidas.", True)])
    receta(mera, "Hospital Clínica Kennedy", 7,
           "Completar todo el tratamiento aunque los síntomas desaparezcan antes.",
           [(amoxicilina, 21, 8, 7, 7, "Completar todo el tratamiento aunque te sientas mejor.", False)])
    db.session.flush()

    # ---- Exámenes (como mockExamenes.js) ----
    def examen(medico, tipo, zona, dias_atras, laboratorio, resultado):
        db.session.add(Examen(
            paciente_id=maria.id, medico_id=medico.id, tipo=tipo,
            zona_cuerpo=zona, fecha=(datetime.utcnow() - timedelta(days=dias_atras)).date(),
            laboratorio=laboratorio, resultado_simple=resultado,
        ))

    examen(andrade, "Radiografía de tórax", ZonaCuerpo.torax, 5, "Interlab",
           "Tus pulmones se ven limpios, sin señales de líquido ni infección.")
    examen(rios, "Ecocardiograma", ZonaCuerpo.torax, 40, "Hospital Luis Vernaza",
           "Tu corazón bombea sangre con normalidad, sin señales de esfuerzo extra.")
    examen(andrade, "Examen de sangre completo", ZonaCuerpo.general, 9, "Interlab",
           "Tu nivel de azúcar está un poco alto. El resto de valores están normales.")
    examen(mera, "Radiografía de rodilla", ZonaCuerpo.pierna_der, 20, "Interlab",
           "No hay fracturas. Hay un leve desgaste normal para tu edad, nada de qué preocuparte.")

    # ---- Pedidos (como mockPedidos.js) ----
    activo = Pedido(
        paciente_id=maria.id, repartidor_id=juan.id,
        direccion_entrega="Av. Francisco de Orellana, Guayaquil",
        estado=EstadoPedido.en_camino, creado_en=hace(minutos=6),
    )
    activo.detalles.append(PedidoDetalle(receta_item_id=r1.items[0].id, farmacia_id=fybeca.id, cantidad_solicitada=10))
    activo.detalles.append(PedidoDetalle(receta_item_id=r3.items[0].id, farmacia_id=cruz_azul.id, cantidad_solicitada=20))

    entregado = Pedido(
        paciente_id=maria.id, repartidor_id=juan.id,
        direccion_entrega="Av. Francisco de Orellana, Guayaquil",
        estado=EstadoPedido.entregado, creado_en=hace(dias=20), entregado_en=hace(dias=20),
    )
    entregado.detalles.append(PedidoDetalle(receta_item_id=r1.items[0].id, farmacia_id=fybeca.id, cantidad_solicitada=30))

    cancelado = Pedido(
        paciente_id=maria.id,
        direccion_entrega="Av. Francisco de Orellana, Guayaquil",
        estado=EstadoPedido.cancelado, creado_en=hace(dias=35),
    )
    cancelado.detalles.append(PedidoDetalle(receta_item_id=r3.items[0].id, farmacia_id=cruz_azul.id, cantidad_solicitada=20))
    db.session.add_all([activo, entregado, cancelado])

    # ---- Notificaciones (como mockNotificaciones.js, sin 'recordatorio':
    #      esos se generan offline en el navegador) ----
    db.session.add_all([
        Notificacion(destinatario_id=maria.id, paciente_relacionado_id=maria.id,
                     tipo=TipoNotificacion.pedido, mensaje="Tu pedido está en camino.",
                     leida=False, fecha=hace(horas=2)),
        Notificacion(destinatario_id=maria.id, paciente_relacionado_id=maria.id,
                     tipo=TipoNotificacion.receta, mensaje="Dr. Andrade te agregó una nueva receta.",
                     leida=True, fecha=hace(horas=26)),
        Notificacion(destinatario_id=maria.id, paciente_relacionado_id=maria.id,
                     tipo=TipoNotificacion.cuidador, mensaje="Ana (tu cuidadora) solicitó una entrega por ti.",
                     leida=True, fecha=hace(dias=3)),
    ])

    db.session.commit()


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        print("Borrando y recreando todas las tablas...")
        db.drop_all()
        db.create_all()
        crear_datos()
        print("Listo. Datos de ejemplo cargados:")
        print("  Paciente:   cédula 0912345678 / celular 0991234567 (María Fernández)")
        print("  Médicos:    0901111111, 0902222222, 0903333333")
        print("  Repartidor: 0904444444 / 0990000004 (Juan Pérez)")
        print("  Cuidadores: Ana (0998887771), Pedro (0998887772)")
