/**
 * Comandos compartidos de las pruebas E2E.
 * El backend corre en modo debug, así que /auth/enviar-codigo devuelve
 * codigoDev — eso permite completar el login sin SMS real.
 */

const api = () => Cypress.env('apiUrl');

// Login vía API y sesión inyectada en localStorage (la app la restaura al abrir).
Cypress.Commands.add('loginApi', (cedula, celular) => {
  return cy
    .request('POST', `${api()}/auth/enviar-codigo`, { cedula, celular })
    .then(({ body }) =>
      cy.request('POST', `${api()}/auth/login`, { cedula, celular, codigo: body.codigoDev })
    )
    .then(({ body }) => body); // { token, usuario }
});

Cypress.Commands.add('visitarComoPaciente', () => {
  cy.loginApi('0912345678', '0991234567').then((sesion) => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('medisalud_token', sesion.token);
        win.localStorage.setItem('medisalud_usuario', JSON.stringify(sesion.usuario));
      },
    });
  });
});

// El repartidor del seed entrega el pedido activo del paciente (si existe),
// dejando el camino libre para que el paciente pueda solicitar uno nuevo.
Cypress.Commands.add('entregarPedidoActivo', () => {
  cy.loginApi('0904444444', '0990000004').then((sesion) => {
    const auth = { Authorization: `Bearer ${sesion.token}` };
    cy.request({ url: `${api()}/repartidor/pedidos`, headers: auth }).then(({ body }) => {
      body.asignados
        .filter((p) => !['entregado', 'cancelado'].includes(p.estado))
        .forEach((p) => {
          cy.request({
            method: 'POST',
            url: `${api()}/repartidor/pedidos/${p.id}/estado`,
            headers: auth,
            body: { estado: 'entregado' },
          });
        });
    });
  });
});
