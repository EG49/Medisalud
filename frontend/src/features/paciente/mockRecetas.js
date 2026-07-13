// MOCK -- reemplazar por api/recetaApi.js -> GET /api/paciente/recetas cuando el backend exista.
// La forma del objeto ya coincide con lo que Flask debería devolver según el modelo de datos.
export const mockRecetas = [
  {
    id: 'r1',
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
  {
    id: 'r2',
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
  {
    id: 'r3',
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
  {
    id: 'r4',
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
];
