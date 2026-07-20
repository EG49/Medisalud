// Comandos globales de Cypress.

Cypress.Commands.add('loginComoPaciente', () => {
  cy.intercept('POST', '**/api/auth/enviar-codigo', {
    statusCode: 200,
    body: { enviado: true },
  }).as('enviarCodigo');

  cy.intercept('POST', '**/api/auth/login', {
    statusCode: 200,
    body: {
      id: 'usuario-test-1',
      nombre: 'María',
      apellidos: 'Fernández',
      cedula: '0912345678',
      celular: '0991234567',
      rol: 'paciente',
    },
  }).as('login');

  cy.visit('/');
  cy.contains('button', 'Ingresar').click();
  cy.get('#cedula').type('0912345678');
  cy.get('#celular').type('0991234567');
  cy.contains('button', 'Enviar código').click();
  cy.wait('@enviarCodigo');
  cy.get('#codigo').type('123456');
  cy.contains('button', 'Iniciar sesión').click();
  cy.wait('@login');
  cy.contains('Hola, María').should('be.visible'); // confirma que sí entró
});
