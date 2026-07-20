describe('Ver recetas', () => {
  beforeEach(() => {
    cy.loginComoPaciente();
  });

  it('muestra las recetas del paciente con médico, hospital y medicamentos', () => {
    cy.contains('a', 'Recetas').click();

    cy.contains('Mis recetas').should('be.visible');

    // Datos que vienen del mock -- confirma que la receta se ve transcrita
    // y legible (médico, hospital, medicamento y dosis en texto claro).
    cy.contains('Dr. Carlos Andrade').should('be.visible');
    cy.contains('Hospital Clínica Kennedy').should('be.visible');
    cy.contains('Paracetamol').should('be.visible');
    cy.contains(/cada \d+ horas, durante \d+ días/).should('be.visible');
  });

  it('muestra las indicaciones adicionales del médico', () => {
    cy.contains('a', 'Recetas').click();
    cy.contains('Indicaciones adicionales').should('be.visible');
  });
});
