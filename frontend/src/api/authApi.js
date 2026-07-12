import { httpClient } from './httpClient';

export function enviarCodigo({ cedula, celular }) {
  return httpClient.post('/auth/enviar-codigo', { cedula, celular });
}

export function iniciarSesion({ cedula, celular, codigo }) {
  return httpClient.post('/auth/login', { cedula, celular, codigo });
}

export function registrarUsuario({ nombre, apellidos, cedula, fechaNacimiento, celular }) {
  // Nota: la foto (File) se sube aparte, típicamente con FormData a un
  // endpoint distinto (/auth/registro/foto) una vez exista el usuario_id.
  return httpClient.post('/auth/registro', {
    nombre,
    apellidos,
    cedula,
    fecha_nacimiento: fechaNacimiento,
    celular,
  });
}
