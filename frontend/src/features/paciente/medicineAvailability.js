/**
 * Cálculo de medicina disponible a partir de una Receta.
 * No depende del servidor -- solo de datos ya sincronizados (fecha_inicio,
 * frecuencia_horas, cantidad_total) y de la hora actual del dispositivo.
 * Por eso puede correr offline (ver decisión de arquitectura: capa offline).
 *
 * receta: { cantidadTotal, frecuenciaHoras, duracionDias, fechaInicio, activa }
 */
export function calcularDisponible(receta) {
  const { cantidadTotal, frecuenciaHoras, fechaInicio, activa } = receta;

  if (!activa) {
    // Tratamiento suspendido: se congela el conteo, no se descuenta más.
    return { disponible: receta.disponibleCongelado ?? cantidadTotal, proximaToma: null };
  }

  const ahora = new Date();
  const inicio = new Date(fechaInicio);
  const horasTranscurridas = Math.max(0, (ahora - inicio) / (1000 * 60 * 60));
  const tomasTranscurridas = Math.floor(horasTranscurridas / frecuenciaHoras);
  const disponible = Math.max(0, cantidadTotal - tomasTranscurridas);

  const proximaToma = new Date(
    inicio.getTime() + (tomasTranscurridas + 1) * frecuenciaHoras * 60 * 60 * 1000
  );

  return {
    disponible,
    proximaToma: disponible > 0 ? proximaToma : null,
  };
}

export function totalTomas(receta) {
  return Math.round((receta.duracionDias * 24) / receta.frecuenciaHoras);
}

// Umbral centralizado de "se está por acabar" -- usado para sugerir
// automáticamente qué medicinas incluir al solicitar un nuevo pedido.
export const UMBRAL_STOCK_BAJO = 2;

export function estaPorAcabarse(disponible) {
  return disponible <= UMBRAL_STOCK_BAJO;
}

/**
 * Busca, entre todos los items de receta activos, cuál tiene la próxima
 * toma más cercana en el tiempo. Se usa en Inicio para destacar "lo que
 * sigue" sin que el paciente tenga que revisar cada medicina una por una.
 */
export function proximaTomaGeneral(items) {
  let mejor = null;

  for (const item of items) {
    const { disponible, proximaToma } = calcularDisponible(item);
    if (!proximaToma || disponible <= 0) continue;
    if (!mejor || proximaToma < mejor.proximaToma) {
      mejor = { item, disponible, proximaToma };
    }
  }

  return mejor;
}
