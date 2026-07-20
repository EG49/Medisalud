import {
  ApiError,
  getToken,
  guardarSesion,
  httpClient,
  limpiarSesion,
  usuarioGuardado,
} from './httpClient';

describe('sesión persistida', () => {
  afterEach(() => limpiarSesion());

  test('guardarSesion + getToken + usuarioGuardado', () => {
    guardarSesion('token-123', { nombre: 'María', rol: 'paciente' });
    expect(getToken()).toBe('token-123');
    expect(usuarioGuardado()).toEqual({ nombre: 'María', rol: 'paciente' });
  });

  test('limpiarSesion borra todo', () => {
    guardarSesion('token-123', { nombre: 'María' });
    limpiarSesion();
    expect(getToken()).toBeNull();
    expect(usuarioGuardado()).toBeNull();
  });

  test('usuarioGuardado devuelve null si no hay sesión o el JSON es inválido', () => {
    expect(usuarioGuardado()).toBeNull();
    localStorage.setItem('medisalud_usuario', '{json roto');
    expect(usuarioGuardado()).toBeNull();
  });
});

describe('httpClient', () => {
  afterEach(() => {
    limpiarSesion();
    jest.restoreAllMocks();
  });

  function mockFetch(respuesta, ok = true, status = 200) {
    global.fetch = jest.fn().mockResolvedValue({
      ok,
      status,
      json: () => Promise.resolve(respuesta),
    });
  }

  test('GET arma la URL y parsea el JSON', async () => {
    mockFetch({ status: 'ok' });
    const datos = await httpClient.get('/health');
    expect(datos).toEqual({ status: 'ok' });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/health',
      expect.objectContaining({ method: 'GET' })
    );
  });

  test('agrega Authorization solo cuando hay token', async () => {
    mockFetch({});
    await httpClient.get('/paciente/perfil');
    expect(fetch.mock.calls[0][1].headers.Authorization).toBeUndefined();

    guardarSesion('mi-token', {});
    await httpClient.get('/paciente/perfil');
    expect(fetch.mock.calls[1][1].headers.Authorization).toBe('Bearer mi-token');
  });

  test('POST serializa el body (y {} si no hay datos)', async () => {
    mockFetch({ id: '1' });
    await httpClient.post('/auth/login', { cedula: '09' });
    expect(fetch.mock.calls[0][1].body).toBe(JSON.stringify({ cedula: '09' }));

    await httpClient.post('/paciente/notificaciones/leer-todas');
    expect(fetch.mock.calls[1][1].body).toBe('{}');
  });

  test('PUT, PATCH y DELETE usan el método correcto', async () => {
    mockFetch({});
    await httpClient.put('/paciente/perfil', { nombre: 'Ana' });
    await httpClient.patch('/x', { a: 1 });
    await httpClient.delete('/y');
    expect(fetch.mock.calls.map((c) => c[1].method)).toEqual(['PUT', 'PATCH', 'DELETE']);
  });

  test('error del servidor → ApiError con message del backend y status', async () => {
    mockFetch({ message: 'El código no es correcto.' }, false, 401);
    await expect(httpClient.post('/auth/login', {})).rejects.toMatchObject({
      message: 'El código no es correcto.',
      status: 401,
      esRed: false,
    });
  });

  test('error sin body JSON → mensaje genérico con el status', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('no json')),
    });
    await expect(httpClient.get('/x')).rejects.toMatchObject({ message: 'Error 500' });
  });

  test('servidor caído → ApiError con esRed=true', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    const promesa = httpClient.get('/paciente/recetas');
    await expect(promesa).rejects.toBeInstanceOf(ApiError);
    await expect(httpClient.get('/x')).rejects.toMatchObject({ esRed: true, status: 0 });
  });
});
