import { API_BASE_URL as BASE_URL } from './apiConfig';

const TOKEN_KEY = 'medisalud_token';
const USUARIO_KEY = 'medisalud_usuario';

// ---- Sesión persistida (sobrevive a recargas y al modo offline de la PWA) ----

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function guardarSesion(token, usuario) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
  } catch {
    /* almacenamiento no disponible (modo incógnito estricto) — sesión solo en memoria */
  }
}

export function usuarioGuardado() {
  try {
    const crudo = localStorage.getItem(USUARIO_KEY);
    return crudo ? JSON.parse(crudo) : null;
  } catch {
    return null;
  }
}

export function limpiarSesion() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
  } catch {
    /* sin almacenamiento, nada que limpiar */
  }
}

// ---- Cliente HTTP ----

/**
 * Error de API. `esRed === true` significa que el servidor no respondió
 * (sin conexión o backend apagado) — la app cae a modo demo con datos
 * de ejemplo en vez de romperse (ver useApi.js).
 */
export class ApiError extends Error {
  constructor(message, status = 0, esRed = false) {
    super(message);
    this.status = status;
    this.esRed = esRed;
  }
}

async function request(path, options = {}) {
  const token = getToken();
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor.', 0, true);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.message || `Error ${response.status}`, response.status);
  }

  return response.json();
}

export const httpClient = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, data) => request(path, { method: 'POST', body: JSON.stringify(data ?? {}) }),
  put: (path, data) => request(path, { method: 'PUT', body: JSON.stringify(data ?? {}) }),
  patch: (path, data) => request(path, { method: 'PATCH', body: JSON.stringify(data ?? {}) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
