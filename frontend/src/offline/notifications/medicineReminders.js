import { calcularDisponible } from '../../features/paciente/medicineAvailability';
import { guardar, obtenerTodos, eliminar } from '../cache/db';

// Los timeouts activos (mientras la pestaña está abierta) -- se pierden si
// se cierra la app, por eso también persistimos en IndexedDB para la
// recuperación al reabrir (ver revisarTomasPerdidas más abajo).
const temporizadoresActivos = new Map();

export function tienePermiso() {
  return typeof Notification !== 'undefined' && Notification.permission === 'granted';
}

function mostrarNotificacion(item) {
  if (!tienePermiso()) return;
  new Notification('Hora de tu medicina', {
    body: `Te toca ${item.medicamento.nombre}`,
    icon: '/assets/logo-icono.png',
    tag: `recordatorio-${item.id}`,
  });
}

/**
 * Programa el recordatorio de la próxima toma de un item de receta.
 * Solo funciona mientras la pestaña/app sigue abierta (ver limitación de
 * plataforma que ya discutimos) -- por eso se complementa con
 * revisarTomasPerdidas() al recargar la app.
 */
export async function programarRecordatorio(item) {
  const { proximaToma, disponible } = calcularDisponible(item);
  if (!proximaToma || disponible <= 0 || !item.activa) return;

  const msRestantes = proximaToma.getTime() - Date.now();
  if (msRestantes <= 0) return;

  // Guarda el recordatorio pendiente en IndexedDB para poder recuperarlo
  // si la app se cierra antes de que llegue la hora.
  await guardar('notificaciones', {
    id: `recordatorio-${item.id}-${proximaToma.getTime()}`,
    tipo: 'recordatorio',
    itemId: item.id,
    medicamentoNombre: item.medicamento.nombre,
    fechaProgramada: proximaToma.toISOString(),
    disparado: false,
  });

  // Timeout máximo seguro en JS es ~24.8 días -- de sobra para esto, las
  // tomas son cada pocas horas, pero por si acaso se limita.
  const timeoutId = setTimeout(() => {
    mostrarNotificacion(item);
  }, Math.min(msRestantes, 2_147_000_000));

  temporizadoresActivos.set(item.id, timeoutId);
}

export function cancelarRecordatorio(itemId) {
  const timeoutId = temporizadoresActivos.get(itemId);
  if (timeoutId) {
    clearTimeout(timeoutId);
    temporizadoresActivos.delete(itemId);
  }
}

/**
 * Se llama al abrir/recargar la app. Revisa si hay tomas cuya hora ya pasó
 * pero cuyo recordatorio nunca se disparó (app cerrada en ese momento) --
 * así no se pierde silenciosamente, se muestra igual apenas hay oportunidad.
 */
export async function revisarTomasPerdidas() {
  const pendientes = await obtenerTodos('notificaciones');
  const ahora = Date.now();

  const perdidas = pendientes.filter(
    (n) => n.tipo === 'recordatorio' && !n.disparado && new Date(n.fechaProgramada).getTime() <= ahora
  );

  for (const recordatorio of perdidas) {
    if (tienePermiso()) {
      new Notification('Se te pasó una toma', {
        body: `¿Ya tomaste tu ${recordatorio.medicamentoNombre}?`,
        icon: '/assets/logo-icono.png',
      });
    }
    await eliminar('notificaciones', recordatorio.id);
  }

  return perdidas;
}
