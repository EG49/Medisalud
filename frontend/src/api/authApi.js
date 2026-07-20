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

// ---- Registro por rol ----
// El backend valida qué roles pueden registrarse públicamente; 'admin' se crea
// solo con backend/scripts/crear_admin.py (ver decisión de seguridad).

/** Paciente — es el registro por defecto. */
export function registrarPaciente({ nombre, apellidos, cedula, fechaNacimiento, celular }) {
  // Nota: la foto (File) se sube aparte, típicamente con FormData a un
  // endpoint distinto (/auth/registro/foto) una vez exista el usuario_id.
  return httpClient.post('/auth/registro/paciente', {
    nombre,
    apellidos,
    cedula,
    fecha_nacimiento: fechaNacimiento,
    celular,
  });
}

export function registrarMedico({ nombre, apellidos, cedula, celular, especialidad, numLicencia }) {
  return httpClient.post('/auth/registro/medico', {
    nombre,
    apellidos,
    cedula,
    celular,
    especialidad,
    num_licencia: numLicencia,
  });
}

export function registrarRepartidor({
  nombre,
  apellidos,
  cedula,
  celular,
  vehiculo,
  zonaCobertura,
}) {
  return httpClient.post('/auth/registro/repartidor', {
    nombre,
    apellidos,
    cedula,
    celular,
    vehiculo,
    zona_cobertura: zonaCobertura,
  });
}

/** Alias histórico: antes solo existía el registro de paciente. */
export const registrarUsuario = registrarPaciente;

export function cerrarSesion() {
  limpiarSesion();
}

export function sesionGuardada() {
  return usuarioGuardado();
}
