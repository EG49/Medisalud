/**
 * Resuelve rutas de la carpeta public/ respetando la base de despliegue.
 * En local la base es '/', pero en GitHub Pages es '/Medisalud/', así que
 * un src="/assets/x.png" fijo se rompería. (En Jest este módulo se mockea.)
 */
export function publicUrl(ruta) {
  return import.meta.env.BASE_URL + String(ruta).replace(/^\//, '');
}
