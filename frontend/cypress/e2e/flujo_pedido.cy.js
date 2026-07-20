/**
 * Flujo crítico 3: solicitar una nueva entrega de medicinas.
 * Primero el repartidor (vía API) entrega el pedido activo del seed,
 * porque el negocio solo permite un pedido en curso a la vez.
 */
describe('Solicitar pedido', () => {
  it('la paciente solicita una nueva entrega y ve el seguimiento', () => {
    cy.entregarPedidoActivo();
    cy.visitarComoPaciente();

    cy.contains('a, button', 'Pedidos').click();
    cy.contains('h1', 'Mis pedidos').should('be.visible');

    // El pedido del seed ya aparece como entregado en el historial
    cy.contains('Historial de pedidos').should('be.visible');
    cy.contains('Entregado').should('be.visible');

    // Solicitar nueva entrega — el formulario pre-marca las medicinas por acabarse
    cy.contains('button', '+ Solicitar nueva entrega').click();
    cy.contains('Solicitar nueva entrega').should('be.visible');
    cy.get('input[type="checkbox"]').first().check();
    cy.contains('button', 'Confirmar pedido').click();

    // El nuevo pedido queda como activo, en estado Solicitado
    cy.contains('Tu pedido actual').should('be.visible');
    cy.contains('Solicitado').should('be.visible');
  });
});
