function etiquetaDia(fecha) {
  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);

  const esMismoDia = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  if (esMismoDia(fecha, hoy)) return 'Hoy';
  if (esMismoDia(fecha, ayer)) return 'Ayer';
  return fecha.toLocaleDateString('es-EC', { day: '2-digit', month: 'long' });
}

export function agruparPorDia(notificaciones) {
  const ordenadas = [...notificaciones].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const grupos = [];
  for (const notificacion of ordenadas) {
    const etiqueta = etiquetaDia(new Date(notificacion.fecha));
    let grupo = grupos.find((g) => g.etiqueta === etiqueta);
    if (!grupo) {
      grupo = { etiqueta, items: [] };
      grupos.push(grupo);
    }
    grupo.items.push(notificacion);
  }
  return grupos;
}
