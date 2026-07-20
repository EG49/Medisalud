import { httpClient } from './httpClient';

export function enviarCodigo({ cedula, celular }) {
  return httpClient.post('/auth/enviar-codigo', { cedula, celular });
}

export function iniciarSesion({ cedula, celular, codigo }) {
  return httpClient.post('/auth/login', { cedula, celular, codigo });
}

export function registrarPaciente({ nombre, apellidos, cedula, fechaNacimiento, celular }) {
  // Nota: la foto (File) se sube aparte, típicamente con FormData a un
  // endpoint distinto (/auth/registro/foto) una vez exista el usuario_id.
  return httpClient.post('/auth/registro', {
    rol: 'paciente',
    nombre,
    apellidos,
    cedula,
    fecha_nacimiento: fechaNacimiento,
    celular,
  });
}

export function registrarMedico({ nombre, apellidos, cedula, celular, especialidad, numLicencia }) {
  return httpClient.post('/auth/registro', {
    rol: 'medico',
    nombre,
    apellidos,
    cedula,
    celular,
    especialidad,
    num_licencia: numLicencia,
  });
}

export function registrarRepartidor({ nombre, apellidos, cedula, celular, vehiculo, zonaCobertura }) {
  return httpClient.post('/auth/registro', {
    rol: 'repartidor',
    nombre,
    apellidos,
    cedula,
    celular,
    vehiculo,
    zona_cobertura: zonaCobertura,
  });
}
