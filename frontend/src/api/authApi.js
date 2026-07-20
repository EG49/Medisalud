import { guardarSesion, httpClient, limpiarSesion, usuarioGuardado } from './httpClient';

export function enviarCodigo({ cedula, celular }) {
  return httpClient.post('/auth/enviar-codigo', { cedula, celular });
}

/**
 * Inicia sesión y persiste la sesión (token + usuario) en localStorage,
 * para que la PWA recuerde al usuario entre recargas y en modo offline.
 * Devuelve el usuario autenticado.
 */
export async function iniciarSesion({ cedula, celular, codigo }) {
  const { token, usuario } = await httpClient.post('/auth/login', { cedula, celular, codigo });
  guardarSesion(token, usuario);
  return usuario;
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

export function cerrarSesion() {
  limpiarSesion();
}

export function sesionGuardada() {
  return usuarioGuardado();
}
