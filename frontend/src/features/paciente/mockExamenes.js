// MOCK -- reemplazar por api/examenApi.js -> GET /api/paciente/examenes cuando el backend exista.
// zonaCuerpo: 'cabeza' | 'torax' | 'abdomen' | 'brazo_izq' | 'brazo_der'
//           | 'pierna_izq' | 'pierna_der' | 'general'
export const mockExamenes = [
  {
    id: 'e1',
    tipo: 'Radiografía de tórax',
    zonaCuerpo: 'torax',
    fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    laboratorio: 'Interlab',
    medico: { nombre: 'Dr. Carlos Andrade' },
    resultadoSimple: 'Tus pulmones se ven limpios, sin señales de líquido ni infección.',
    archivoUrl: '/mock-files/radiografia-torax.pdf',
  },
  {
    id: 'e2',
    tipo: 'Ecocardiograma',
    zonaCuerpo: 'torax',
    fecha: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    laboratorio: 'Hospital Luis Vernaza',
    medico: { nombre: 'Dra. Elena Ríos' },
    resultadoSimple: 'Tu corazón bombea sangre con normalidad, sin señales de esfuerzo extra.',
    archivoUrl: '/mock-files/ecocardiograma.pdf',
  },
  {
    id: 'e3',
    tipo: 'Examen de sangre completo',
    zonaCuerpo: 'general',
    fecha: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    laboratorio: 'Interlab',
    medico: { nombre: 'Dr. Carlos Andrade' },
    resultadoSimple: 'Tu nivel de azúcar está un poco alto. El resto de valores están normales.',
    archivoUrl: '/mock-files/sangre-completa.pdf',
  },
  {
    id: 'e4',
    tipo: 'Radiografía de rodilla',
    zonaCuerpo: 'pierna_der',
    fecha: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    laboratorio: 'Interlab',
    medico: { nombre: 'Dra. Sofía Mera' },
    resultadoSimple: 'No hay fracturas. Hay un leve desgaste normal para tu edad, nada de qué preocuparte.',
    archivoUrl: '/mock-files/radiografia-rodilla.pdf',
  },
];

export function contarExamenesPorZona(examenes) {
  return examenes.reduce((conteo, examen) => {
    conteo[examen.zonaCuerpo] = (conteo[examen.zonaCuerpo] ?? 0) + 1;
    return conteo;
  }, {});
}
