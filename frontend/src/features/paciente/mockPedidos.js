// MOCK -- reemplazar por api/pedidoApi.js -> GET /api/paciente/pedidos cuando el backend exista.
export const ESTADOS_PEDIDO = [
  { id: 'solicitado', label: 'Solicitado' },
  { id: 'confirmado', label: 'Confirmado' },
  { id: 'en_preparacion', label: 'En preparación' },
  { id: 'en_camino', label: 'En camino' },
  { id: 'entregado', label: 'Entregado' },
];

export const direccionPerfil = 'Av. Francisco de Orellana, Guayaquil';

export const mockPedidoActivo = {
  id: 'ped1',
  estado: 'en_camino',
  direccionEntrega: direccionPerfil,
  repartidor: { nombre: 'Juan Pérez' },
  actualizadoEn: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
  items: [
    {
      id: 'ped1-i1',
      medicamentoNombre: 'Paracetamol',
      cantidadSolicitada: 10,
      farmacia: { nombre: 'Fybeca' },
    },
    {
      id: 'ped1-i2',
      medicamentoNombre: 'Metformina',
      cantidadSolicitada: 20,
      farmacia: { nombre: 'Farmacias Cruz Azul' },
    },
  ],
};

export const mockHistorialPedidos = [
  {
    id: 'ped0',
    estado: 'entregado',
    fecha: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { id: 'ped0-i1', medicamentoNombre: 'Losartán', farmacia: { nombre: 'Fybeca' } },
    ],
  },
  {
    id: 'ped-1',
    estado: 'cancelado',
    fecha: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { id: 'ped-1-i1', medicamentoNombre: 'Amoxicilina', farmacia: { nombre: 'Farmacias Cruz Azul' } },
    ],
  },
];
