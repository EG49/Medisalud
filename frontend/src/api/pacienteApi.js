/**
 * Endpoints del dashboard del paciente (backend Flask, backend/app/routes/paciente_routes.py).
 * Los formatos de respuesta son idénticos a los antiguos mocks — ver backend/README.md.
 */

import { httpClient } from './httpClient';

// Perfil
export const getPerfil = () => httpClient.get('/paciente/perfil');
export const actualizarPerfil = (campos) => httpClient.put('/paciente/perfil', campos);

// Recetas y exámenes
export const getRecetas = () => httpClient.get('/paciente/recetas');
export const getExamenes = () => httpClient.get('/paciente/examenes');

// Pedidos — getPedidos devuelve { activo, historial }
export const getPedidos = () => httpClient.get('/paciente/pedidos');
export const crearPedido = ({ direccionEntrega, items }) =>
  httpClient.post('/paciente/pedidos', { direccionEntrega, items });
export const cancelarPedido = (pedidoId) =>
  httpClient.post(`/paciente/pedidos/${pedidoId}/cancelar`);

// Notificaciones
export const getNotificaciones = () => httpClient.get('/paciente/notificaciones');
export const marcarNotificacionLeida = (id) =>
  httpClient.post(`/paciente/notificaciones/${id}/leer`);
export const marcarTodasLeidas = () => httpClient.post('/paciente/notificaciones/leer-todas');

// Cuidadores — getCuidadores devuelve { vinculados, solicitudesRecibidas, invitacionesEnviadas }
export const getCuidadores = () => httpClient.get('/paciente/cuidadores');
export const invitarCuidador = ({ celular, relacion }) =>
  httpClient.post('/paciente/cuidadores/invitar', { celular, relacion });
export const aprobarSolicitud = (vinculoId) =>
  httpClient.post(`/paciente/cuidadores/solicitudes/${vinculoId}/aprobar`);
export const rechazarSolicitud = (vinculoId) =>
  httpClient.post(`/paciente/cuidadores/solicitudes/${vinculoId}/rechazar`);
export const quitarCuidador = (vinculoId) => httpClient.delete(`/paciente/cuidadores/${vinculoId}`);

// Catálogos
export const getFarmacias = () => httpClient.get('/farmacias');
