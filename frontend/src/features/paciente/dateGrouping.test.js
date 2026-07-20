import { agruparPorDia } from './dateGrouping';

const HORA = 60 * 60 * 1000;
const DIA = 24 * HORA;

describe('agruparPorDia', () => {
  test('agrupa en Hoy / Ayer / fecha, ordenado de lo más reciente a lo más viejo', () => {
    const notificaciones = [
      { id: 'a', fecha: new Date(Date.now() - 5 * DIA).toISOString() },
      { id: 'b', fecha: new Date().toISOString() },
      { id: 'c', fecha: new Date(Date.now() - 1 * DIA).toISOString() },
      { id: 'd', fecha: new Date(Date.now() - 1 * HORA).toISOString() },
    ];

    const grupos = agruparPorDia(notificaciones);

    expect(grupos[0].etiqueta).toBe('Hoy');
    expect(grupos[0].items.map((n) => n.id)).toEqual(['b', 'd']);
    expect(grupos[1].etiqueta).toBe('Ayer');
    expect(grupos[1].items.map((n) => n.id)).toEqual(['c']);
    // El grupo viejo usa fecha formateada (no Hoy/Ayer)
    expect(grupos[2].etiqueta).not.toMatch(/Hoy|Ayer/);
    expect(grupos[2].items.map((n) => n.id)).toEqual(['a']);
  });

  test('no muta el arreglo original y funciona con lista vacía', () => {
    const original = [
      { id: '1', fecha: new Date(Date.now() - 2 * DIA).toISOString() },
      { id: '2', fecha: new Date().toISOString() },
    ];
    const copia = [...original];
    agruparPorDia(original);
    expect(original).toEqual(copia);
    expect(agruparPorDia([])).toEqual([]);
  });
});
