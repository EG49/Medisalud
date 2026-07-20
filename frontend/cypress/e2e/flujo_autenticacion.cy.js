/**
 * Flujo crítico 1: registro e inicio de sesión con código de verificación.
 */
describe('Autenticación', () => {
  it('un usuario nuevo se registra y luego inicia sesión con el código', () => {
    const cedula = `09${Date.now().toString().slice(-8)}`;
    const celular = `098${Date.now().toString().slice(-7)}`;

    // Registro por UI (los campos del RegisterForm usan id, no name)
    cy.visit('/');
    cy.contains('button', 'Registrarse').first().click();
    cy.get('#nombre').type('Rosa');
    cy.get('#apellidos').type('Delgado');
    cy.get('#cedula').type(cedula);
    cy.get('#celular').type(celular);
    cy.contains('form[aria-label="Formulario de registro"] button', 'Registrarse').click();

    // Login: capturamos el codigoDev que devuelve el backend en modo debug
    cy.contains('button', 'Ingresar').first().click();
    cy.intercept('POST', '**/auth/enviar-codigo').as('enviarCodigo');

    cy.get('input[name="cedula"]').type(cedula);
    cy.get('input[name="celular"]').type(celular);
    cy.contains('button', 'Enviar código').click();

    cy.wait('@enviarCodigo').then(({ response }) => {
      cy.get('input[name="codigo"]').type(response.body.codigoDev);
      cy.contains('button', 'Iniciar sesión').click();
    });

    // Dentro del dashboard
    cy.contains('h1', 'Hola, Rosa').should('be.visible');
  });

  it('rechaza un código incorrecto', () => {
    cy.visit('/');
    cy.contains('button', 'Ingresar').first().click();

    cy.get('input[name="cedula"]').type('0912345678');
    cy.get('input[name="celular"]').type('0991234567');
    cy.contains('button', 'Enviar código').click();

    cy.on('window:alert', (texto) => {
      expect(texto).to.match(/código no es correcto|Primero solicita/);
    });
    cy.get('input[name="codigo"]').type('000000');
    cy.contains('button', 'Iniciar sesión').click();

    // Sigue en el login (no navegó al dashboard)
    cy.contains('h1', 'Hola,').should('not.exist');
  });
});
