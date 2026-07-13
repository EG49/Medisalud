// MOCK -- en la app real esto se arma combinando:
// - offline/notifications/medicineReminders.js (recordatorios, generados localmente)
// - GET /api/paciente/notificaciones (pedidos, recetas, actividad de cuidador -- del servidor)
// tipo: 'recordatorio' | 'pedido' | 'receta' | 'cuidador'
export const mockNotificaciones = [
  {
    id: 'n1',
    tipo: 'recordatorio',
    mensaje: 'Es hora de tomar tu Paracetamol.',
    fecha: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    leida: false,
  },
  {
    id: 'n2',
    tipo: 'pedido',
    mensaje: 'Tu pedido está en camino.',
    fecha: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    leida: false,
  },
  {
    id: 'n3',
    tipo: 'receta',
    mensaje: 'Dr. Andrade te agregó una nueva receta.',
    fecha: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    leida: true,
  },
  {
    id: 'n4',
    tipo: 'cuidador',
    mensaje: 'María (tu cuidadora) solicitó una entrega por ti.',
    fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    leida: true,
  },
];
