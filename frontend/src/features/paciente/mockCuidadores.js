// MOCK -- reemplazar por api/cuidadorApi.js cuando exista Flask.
// Invitación en ambos sentidos: el paciente invita, o el cuidador solicita acceso.
export const mockCuidadoresVinculados = [
  { id: 'c1', nombre: 'Ana Fernández', relacion: 'Hija', autorizadoPedidos: true },
];

export const mockSolicitudesRecibidas = [
  // Alguien pidió ser cuidador del paciente -- el paciente aprueba/rechaza.
  { id: 's1', nombre: 'Pedro Fernández', relacion: 'Hijo' },
];

export const mockInvitacionesEnviadas = [
  // El paciente invitó a alguien -- queda pendiente hasta que esa persona acepte.
  { id: 'i1', destinatario: '0998887777', fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
];
