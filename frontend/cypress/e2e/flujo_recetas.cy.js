/**
 * Flujo crítico 2: la paciente ve sus recetas y medicinas reales del backend.
 */
describe('Recetas y medicinas', () => {
  beforeEach(() => {
    cy.visitarComoPaciente();
  });

  it('muestra el dashboard con datos reales del seed', () => {
    cy.contains('h1', 'Hola, María').should('be.visible');
    cy.contains('Recetas').should('be.visible');
  });

  it('lista las recetas emitidas por los médicos', () => {
    cy.contains('a, button', 'Recetas').click();
    cy.contains('h1', 'Mis recetas').should('be.visible');

    // Datos cargados por backend/seed.py
    cy.contains('Paracetamol').should('be.visible');
    cy.contains('Carlos Andrade').should('be.visible');
    cy.contains('Hospital Clínica Kennedy').should('be.visible');
  });

  it('muestra las medicinas con dosis disponibles calculadas', () => {
    cy.contains('a, button', 'Medicinas').click();
    cy.contains('h1', 'Mis medicinas').should('be.visible');
    cy.contains('Losartán').should('be.visible');
    cy.contains(/de \d+ disponibles/).should('be.visible');
  });

  it('muestra los exámenes con su explicación simple', () => {
    cy.contains('a, button', 'Exámenes').click();
    cy.contains('h1', 'Mis exámenes').should('be.visible');
    cy.contains('Radiografía de tórax').should('be.visible');
    cy.contains('Tus pulmones se ven limpios').should('be.visible');
  });
});
