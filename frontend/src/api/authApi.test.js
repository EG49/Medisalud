import { cerrarSesion, enviarCodigo, iniciarSesion, registrarUsuario, sesionGuardada } from './authApi';
import { getToken, limpiarSesion } from './httpClient';

function mockFetch(respuesta) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(respuesta),
  });
}

afterEach(() => {
  limpiarSesion();
  jest.restoreAllMocks();
});

test('enviarCodigo hace POST a /auth/enviar-codigo', async () => {
  mockFetch({ mensaje: 'enviado' });
  await enviarCodigo({ cedula: '0912345678', celular: '0991234567' });
  expect(fetch).toHaveBeenCalledWith(
    'http://localhost:5000/api/auth/enviar-codigo',
    expect.objectContaining({ method: 'POST' })
  );
});

test('iniciarSesion guarda token y usuario, y devuelve el usuario', async () => {
  const usuario = { id: 'u1', nombre: 'María', rol: 'paciente' };
  mockFetch({ token: 'token-abc', usuario });

  const resultado = await iniciarSesion({ cedula: '09', celular: '099', codigo: '123456' });

  expect(resultado).toEqual(usuario);
  expect(getToken()).toBe('token-abc');
  expect(sesionGuardada()).toEqual(usuario);
});

test('registrarUsuario manda fecha_nacimiento en snake_case (contrato del backend)', async () => {
  mockFetch({ id: 'u2' });
  await registrarUsuario({
    nombre: 'Luis',
    apellidos: 'Prueba',
    cedula: '0999999999',
    fechaNacimiento: '1950-01-01',
    celular: '0955555555',
  });
  const body = JSON.parse(fetch.mock.calls[0][1].body);
  expect(body.fecha_nacimiento).toBe('1950-01-01');
  expect(body.fechaNacimiento).toBeUndefined();
});

test('cerrarSesion limpia la sesión guardada', async () => {
  mockFetch({ token: 't', usuario: { id: 'u1' } });
  await iniciarSesion({ cedula: '09', celular: '099', codigo: '1' });
  cerrarSesion();
  expect(getToken()).toBeNull();
  expect(sesionGuardada()).toBeNull();
});
