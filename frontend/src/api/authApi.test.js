import {
  cerrarSesion,
  enviarCodigo,
  iniciarSesion,
  registrarMedico,
  registrarPaciente,
  registrarRepartidor,
  sesionGuardada,
} from './authApi';
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

test('registrarPaciente manda fecha_nacimiento en snake_case (contrato del backend)', async () => {
  mockFetch({ id: 'u2' });
  await registrarPaciente({
    nombre: 'Luis',
    apellidos: 'Prueba',
    cedula: '0999999999',
    fechaNacimiento: '1950-01-01',
    celular: '0955555555',
  });
  const [url, opciones] = fetch.mock.calls[0];
  expect(url).toBe('http://localhost:5000/api/auth/registro/paciente');
  const body = JSON.parse(opciones.body);
  expect(body.fecha_nacimiento).toBe('1950-01-01');
  expect(body.fechaNacimiento).toBeUndefined();
});

test('registrarMedico usa su ruta y traduce numLicencia', async () => {
  mockFetch({ id: 'm1' });
  await registrarMedico({
    nombre: 'Elena',
    apellidos: 'Ríos',
    cedula: '0902222222',
    celular: '0990000002',
    especialidad: 'Cardiología',
    numLicencia: 'MED-1002',
  });
  const [url, opciones] = fetch.mock.calls[0];
  expect(url).toBe('http://localhost:5000/api/auth/registro/medico');
  expect(JSON.parse(opciones.body).num_licencia).toBe('MED-1002');
});

test('registrarRepartidor usa su ruta y traduce zonaCobertura', async () => {
  mockFetch({ id: 'r1' });
  await registrarRepartidor({
    nombre: 'Juan',
    apellidos: 'Pérez',
    cedula: '0904444444',
    celular: '0990000004',
    vehiculo: 'Moto',
    zonaCobertura: 'Guayaquil Norte',
  });
  const [url, opciones] = fetch.mock.calls[0];
  expect(url).toBe('http://localhost:5000/api/auth/registro/repartidor');
  expect(JSON.parse(opciones.body).zona_cobertura).toBe('Guayaquil Norte');
});

test('cerrarSesion limpia la sesión guardada', async () => {
  mockFetch({ token: 't', usuario: { id: 'u1' } });
  await iniciarSesion({ cedula: '09', celular: '099', codigo: '1' });
  cerrarSesion();
  expect(getToken()).toBeNull();
  expect(sesionGuardada()).toBeNull();
});
