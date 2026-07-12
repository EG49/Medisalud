import { httpClient } from './httpClient';

export function enviarCodigo({ cedula, celular }) {
  return httpClient.post('/auth/enviar-codigo', { cedula, celular });
}

export function iniciarSesion({ cedula, celular, codigo }) {
  return httpClient.post('/auth/login', { cedula, celular, codigo });
}
