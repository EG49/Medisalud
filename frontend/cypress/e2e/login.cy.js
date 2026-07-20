describe('Login con código de verificación', () => {
  it('permite iniciar sesión y llegar al dashboard', () => {
    cy.loginComoPaciente();
    cy.contains('Medicinas').should('be.visible'); // sidebar del dashboard visible
  });

  it('muestra un mensaje si el login falla y no navega al dashboard', () => {
    cy.intercept('POST', '**/api/auth/enviar-codigo', {
      statusCode: 200,
      body: { enviado: true },
    }).as('enviarCodigo');

    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 400,
      body: { message: 'Código incorrecto.' },
    }).as('loginFallido');

    cy.visit('/');
    cy.contains('button', 'Ingresar').click();
    cy.get('#cedula').type('0912345678');
    cy.get('#celular').type('0991234567');
    cy.contains('button', 'Enviar código').click();
    cy.wait('@enviarCodigo');

    cy.get('#codigo').type('000000');
    cy.contains('button', 'Iniciar sesión').click();
    cy.wait('@loginFallido');

    // Sigue en el formulario de login -- no navegó al dashboard.
    cy.get('#cedula').should('be.visible');
  });
});
