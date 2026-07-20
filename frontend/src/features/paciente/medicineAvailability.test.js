import {
  calcularDisponible,
  estaPorAcabarse,
  proximaTomaGeneral,
  totalTomas,
  UMBRAL_STOCK_BAJO,
} from './medicineAvailability';

const HORA = 60 * 60 * 1000;

function recetaBase(extra = {}) {
  return {
    cantidadTotal: 10,
    frecuenciaHoras: 12,
    duracionDias: 5,
    fechaInicio: new Date(Date.now() - 24 * HORA).toISOString(), // hace 1 día
    activa: true,
    ...extra,
  };
}

describe('calcularDisponible', () => {
  test('descuenta una toma por cada intervalo transcurrido', () => {
    // 24 horas / cada 12 horas = 2 tomas consumidas → quedan 8
    const { disponible, proximaToma } = calcularDisponible(recetaBase());
    expect(disponible).toBe(8);
    expect(proximaToma).toBeInstanceOf(Date);
  });

  test('sin tiempo transcurrido no descuenta nada', () => {
    const { disponible } = calcularDisponible(
      recetaBase({ fechaInicio: new Date().toISOString() })
    );
    expect(disponible).toBe(10);
  });

  test('nunca baja de 0 aunque pase mucho tiempo', () => {
    const { disponible, proximaToma } = calcularDisponible(
      recetaBase({ fechaInicio: new Date(Date.now() - 1000 * HORA).toISOString() })
    );
    expect(disponible).toBe(0);
    expect(proximaToma).toBeNull(); // sin dosis no hay próxima toma
  });

  test('si la fecha de inicio es futura, no descuenta (horas negativas → 0 tomas)', () => {
    const { disponible } = calcularDisponible(
      recetaBase({ fechaInicio: new Date(Date.now() + 48 * HORA).toISOString() })
    );
    expect(disponible).toBe(10);
  });

  test('tratamiento suspendido congela el conteo en disponibleCongelado', () => {
    const r = recetaBase({ activa: false, disponibleCongelado: 3 });
    expect(calcularDisponible(r)).toEqual({ disponible: 3, proximaToma: null });
  });

  test('tratamiento suspendido sin disponibleCongelado usa cantidadTotal', () => {
    const r = recetaBase({ activa: false });
    expect(calcularDisponible(r).disponible).toBe(10);
  });
});

describe('totalTomas', () => {
  test('calcula tomas totales del tratamiento', () => {
    // 5 días * 24h / cada 12h = 10 tomas
    expect(totalTomas(recetaBase())).toBe(10);
    expect(totalTomas({ duracionDias: 7, frecuenciaHoras: 8 })).toBe(21);
  });
});

describe('estaPorAcabarse', () => {
  test('true en el umbral y por debajo, false por encima', () => {
    expect(estaPorAcabarse(UMBRAL_STOCK_BAJO)).toBe(true);
    expect(estaPorAcabarse(0)).toBe(true);
    expect(estaPorAcabarse(UMBRAL_STOCK_BAJO + 1)).toBe(false);
  });
});

describe('proximaTomaGeneral', () => {
  test('elige el item con la próxima toma más cercana', () => {
    const pronto = recetaBase({ frecuenciaHoras: 25 }); // próxima en ~1h
    const tarde = recetaBase({ frecuenciaHoras: 12, fechaInicio: new Date().toISOString() }); // próxima en 12h
    const mejor = proximaTomaGeneral([tarde, pronto]);
    expect(mejor.item).toBe(pronto);
  });

  test('ignora items sin dosis disponibles o suspendidos', () => {
    const agotado = recetaBase({ fechaInicio: new Date(Date.now() - 1000 * HORA).toISOString() });
    const suspendido = recetaBase({ activa: false });
    expect(proximaTomaGeneral([agotado, suspendido])).toBeNull();
  });

  test('con lista vacía devuelve null', () => {
    expect(proximaTomaGeneral([])).toBeNull();
  });
});
