describe('Solicitar pedido', () => {
  beforeEach(() => {
    cy.loginComoPaciente();
    cy.contains('a', 'Pedidos').click();
  });

  it('abre el formulario y sugiere automáticamente las medicinas por acabarse', () => {
    cy.contains('button', '+ Solicitar nueva entrega').click();

    // Amoxicilina está inactiva/agotada en el mock -> debe venir pre-marcada
    // como sugerida (estaPorAcabarse), tal como definimos.
    cy.contains('li', 'Amoxicilina')
      .should('contain.text', 'Se está acabando')
      .find('input[type="checkbox"]')
      .should('be.checked');
  });

  it('permite confirmar el pedido con la dirección por defecto', () => {
    cy.contains('button', '+ Solicitar nueva entrega').click();

    cy.contains('Dirección de entrega')
      .parent()
      .should('contain.text', 'Guayaquil');

    cy.contains('button', 'Confirmar pedido').click();

    // El formulario se cierra y vuelve a aparecer el botón de solicitar.
    cy.contains('button', '+ Solicitar nueva entrega').should('be.visible');
  });

  it('permite cambiar la dirección de entrega para ese pedido', () => {
    cy.contains('button', '+ Solicitar nueva entrega').click();
    cy.contains('button', 'Cambiar dirección para esta entrega').click();

    cy.get('input[aria-label="Dirección de entrega"]')
      .clear()
      .type('Nueva dirección de prueba 123');

    cy.contains('button', 'Usar esta dirección').click();
    cy.contains('Nueva dirección de prueba 123').should('be.visible');
  });
});
