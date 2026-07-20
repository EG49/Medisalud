import * as pacienteApi from './pacienteApi';

function mockFetch(respuesta = {}) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(respuesta),
  });
}

afterEach(() => jest.restoreAllMocks());

const BASE = 'http://localhost:5000/api';

test.each([
  [() => pacienteApi.getPerfil(), 'GET', '/paciente/perfil'],
  [() => pacienteApi.getRecetas(), 'GET', '/paciente/recetas'],
  [() => pacienteApi.getExamenes(), 'GET', '/paciente/examenes'],
  [() => pacienteApi.getPedidos(), 'GET', '/paciente/pedidos'],
  [() => pacienteApi.getNotificaciones(), 'GET', '/paciente/notificaciones'],
  [() => pacienteApi.getCuidadores(), 'GET', '/paciente/cuidadores'],
  [() => pacienteApi.getFarmacias(), 'GET', '/farmacias'],
  [() => pacienteApi.marcarNotificacionLeida('n1'), 'POST', '/paciente/notificaciones/n1/leer'],
  [() => pacienteApi.marcarTodasLeidas(), 'POST', '/paciente/notificaciones/leer-todas'],
  [() => pacienteApi.cancelarPedido('p1'), 'POST', '/paciente/pedidos/p1/cancelar'],
  [() => pacienteApi.aprobarSolicitud('v1'), 'POST', '/paciente/cuidadores/solicitudes/v1/aprobar'],
  [() => pacienteApi.rechazarSolicitud('v1'), 'POST', '/paciente/cuidadores/solicitudes/v1/rechazar'],
  [() => pacienteApi.quitarCuidador('v1'), 'DELETE', '/paciente/cuidadores/v1'],
])('llama %# con el método y la ruta correctos', async (llamar, metodo, ruta) => {
  mockFetch();
  await llamar();
  expect(fetch).toHaveBeenCalledWith(BASE + ruta, expect.objectContaining({ method: metodo }));
});

test('actualizarPerfil hace PUT con los campos', async () => {
  mockFetch();
  await pacienteApi.actualizarPerfil({ direccion: 'Alborada' });
  const [url, opciones] = fetch.mock.calls[0];
  expect(url).toBe(`${BASE}/paciente/perfil`);
  expect(opciones.method).toBe('PUT');
  expect(JSON.parse(opciones.body)).toEqual({ direccion: 'Alborada' });
});

test('crearPedido manda direccionEntrega e items con el contrato del backend', async () => {
  mockFetch();
  await pacienteApi.crearPedido({
    direccionEntrega: 'Av. Orellana',
    items: [{ recetaItemId: 'ri1', farmaciaId: 'f1', cantidad: 10 }],
  });
  const body = JSON.parse(fetch.mock.calls[0][1].body);
  expect(body).toEqual({
    direccionEntrega: 'Av. Orellana',
    items: [{ recetaItemId: 'ri1', farmaciaId: 'f1', cantidad: 10 }],
  });
});

test('invitarCuidador manda celular y relación', async () => {
  mockFetch();
  await pacienteApi.invitarCuidador({ celular: '0998887777', relacion: 'Hija' });
  expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
    celular: '0998887777',
    relacion: 'Hija',
  });
});
