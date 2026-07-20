import { pacienteSidebarMenu } from './sidebarMenu';
import { contarExamenesPorZona, mockExamenes } from './mockExamenes';

describe('pacienteSidebarMenu', () => {
  test('contiene las 7 secciones del dashboard del paciente', () => {
    expect(pacienteSidebarMenu.map((i) => i.id)).toEqual([
      'inicio',
      'medicinas',
      'recetas',
      'examenes',
      'pedidos',
      'notificaciones',
      'perfil',
    ]);
    pacienteSidebarMenu.forEach((item) => {
      expect(item.label).toBeTruthy();
      expect(item.icon).toBeTruthy();
      expect(item.href).toMatch(/^\/paciente\//);
    });
  });
});

describe('contarExamenesPorZona', () => {
  test('cuenta exámenes agrupados por zona del cuerpo', () => {
    const conteo = contarExamenesPorZona(mockExamenes);
    expect(conteo.torax).toBe(2);
    expect(conteo.general).toBe(1);
    expect(conteo.pierna_der).toBe(1);
  });

  test('con lista vacía devuelve objeto vacío', () => {
    expect(contarExamenesPorZona([])).toEqual({});
  });
});
