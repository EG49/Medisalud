// MOCK -- reemplazar por api/recetaApi.js -> GET /api/paciente/recetas cuando el backend exista.
// Cada receta es un DOCUMENTO (una visita: un médico, un hospital, una fecha)
// que contiene uno o más medicamentos (items). La disponibilidad se calcula
// por item, no por documento.
export const mockRecetas = [
  {
    id: 'p1',
    medico: { nombre: 'Dr. Carlos Andrade', especialidad: 'Medicina General' },
    hospital: 'Hospital Clínica Kennedy',
    fechaEmision: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    indicacionesExtra: 'Reposo relativo. Volver a consulta si la fiebre persiste más de 48 horas.',
    items: [
      {
        id: 'p1-m1',
        medicamento: {
          nombre: 'Paracetamol',
          presentacion: 'Tableta 500mg',
          descripcionUso: 'Alivia el dolor leve a moderado y baja la fiebre.',
        },
        cantidadTotal: 10,
        frecuenciaHoras: 12,
        duracionDias: 5,
        fechaInicio: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        indicaciones: 'Tomar con alimentos.',
        activa: true,
      },
    ],
  },
  {
    id: 'p2',
    medico: { nombre: 'Dra. Elena Ríos', especialidad: 'Cardiología' },
    hospital: 'Hospital Luis Vernaza',
    fechaEmision: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    indicacionesExtra: 'Control de presión arterial en casa 2 veces por semana. Próxima cita en 30 días.',
    items: [
      {
        id: 'p2-m1',
        medicamento: {
          nombre: 'Losartán',
          presentacion: 'Tableta 50mg',
          descripcionUso: 'Controla la presión arterial alta.',
        },
        cantidadTotal: 30,
        frecuenciaHoras: 24,
        duracionDias: 30,
        fechaInicio: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        indicaciones: 'Tomar siempre a la misma hora, en ayunas.',
        activa: true,
      },
    ],
  },
  {
    id: 'p3',
    medico: { nombre: 'Dr. Carlos Andrade', especialidad: 'Medicina General' },
    hospital: 'Hospital Clínica Kennedy',
    fechaEmision: new Date(Date.now() - 9.5 * 24 * 60 * 60 * 1000).toISOString(),
    indicacionesExtra: 'Traer resultados de glucosa en ayunas en la próxima cita.',
    items: [
      {
        id: 'p3-m1',
        medicamento: {
          nombre: 'Metformina',
          presentacion: 'Tableta 850mg',
          descripcionUso: 'Ayuda a controlar el nivel de azúcar en la sangre.',
        },
        cantidadTotal: 20,
        frecuenciaHoras: 12,
        duracionDias: 10,
        fechaInicio: new Date(Date.now() - 9.5 * 24 * 60 * 60 * 1000).toISOString(),
        indicaciones: 'Tomar después de las comidas.',
        activa: true,
      },
    ],
  },
  {
    id: 'p4',
    medico: { nombre: 'Dra. Sofía Mera', especialidad: 'Medicina Interna' },
    hospital: 'Hospital Clínica Kennedy',
    fechaEmision: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    indicacionesExtra: 'Completar todo el tratamiento aunque los síntomas desaparezcan antes.',
    items: [
      {
        id: 'p4-m1',
        medicamento: {
          nombre: 'Amoxicilina',
          presentacion: 'Cápsula 500mg',
          descripcionUso: 'Antibiótico para tratar infecciones bacterianas.',
        },
        cantidadTotal: 21,
        frecuenciaHoras: 8,
        duracionDias: 7,
        fechaInicio: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        indicaciones: 'Completar todo el tratamiento aunque te sientas mejor.',
        activa: false,
        disponibleCongelado: 0,
      },
    ],
  },
];
