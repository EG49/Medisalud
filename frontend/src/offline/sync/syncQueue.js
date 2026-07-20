import { guardar, obtenerTodos, eliminar } from '../cache/db';

/**
 * Encola una acción hecha sin conexión (ej. "confirmar pedido",
 * "marcar toma como hecha"). No la ejecuta -- solo la guarda para
 * reenviarla después con procesarCola().
 *
 * accion: { tipo: string, payload: object }
 */
export async function agregarAccionPendiente(accion) {
  const item = {
    id: `sync-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    tipo: accion.tipo,
    payload: accion.payload,
    creadaEn: new Date().toISOString(),
  };
  await guardar('sync_queue', item);
  return item;
}

export async function obtenerAccionesPendientes() {
  return obtenerTodos('sync_queue');
}

/**
 * Procesa todo lo pendiente en la cola, en el orden en que se creó.
 * `manejadores` es un mapa { tipo: async (payload) => void } -- uno por
 * cada tipo de acción que se pueda encolar. Si una acción falla (ej. sigue
 * sin señal), se detiene ahí y deja el resto en la cola para el próximo intento.
 */
export async function procesarCola(manejadores) {
  const pendientes = await obtenerAccionesPendientes();
  const ordenadas = pendientes.sort(
    (a, b) => new Date(a.creadaEn) - new Date(b.creadaEn)
  );

  const resultado = { procesadas: 0, fallidas: 0 };

  for (const accion of ordenadas) {
    const manejador = manejadores[accion.tipo];
    if (!manejador) {
      console.warn(`Sin manejador para la acción de tipo "${accion.tipo}", se omite.`);
      continue;
    }

    try {
      await manejador(accion.payload);
      await eliminar('sync_queue', accion.id);
      resultado.procesadas += 1;
    } catch (error) {
      // Se detiene aquí: si esta falló (probablemente por falta de señal
      // todavía), seguir con las siguientes podría desordenar dependencias
      // entre acciones. Se reintenta todo desde el inicio la próxima vez.
      console.warn('No se pudo sincronizar una acción pendiente, se reintentará después.', error);
      resultado.fallidas += 1;
      break;
    }
  }

  return resultado;
}

/**
 * Registra el reintento automático apenas vuelve la conexión.
 * Se llama una vez al iniciar la app (ver App.jsx).
 */
export function registrarSincronizacionAutomatica(manejadores) {
  window.addEventListener('online', () => {
    procesarCola(manejadores);
  });
}
