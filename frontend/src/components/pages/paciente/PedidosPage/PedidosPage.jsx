import { useState } from 'react';
import DashboardLayout from '../../../templates/DashboardLayout/DashboardLayout';
import PedidoActivoCard from '../../../molecules/PedidoActivoCard/PedidoActivoCard';
import PedidoHistorialCard from '../../../molecules/PedidoHistorialCard/PedidoHistorialCard';
import SolicitarPedidoForm from '../../../organisms/SolicitarPedidoForm/SolicitarPedidoForm';
import Button from '../../../atoms/Button/Button';
import { pacienteSidebarMenu } from '../../../../features/paciente/sidebarMenu';
import {
  mockPedidoActivo,
  mockHistorialPedidos,
  direccionPerfil,
} from '../../../../features/paciente/mockPedidos';
import styles from './PedidosPage.module.css';

export default function PedidosPage({ usuario, onLogout, onNavigate }) {
  // TODO: reemplazar mocks por pedidoApi.getPedidoActivo() / getHistorial() cuando exista Flask.
  const [pedidoActivo, setPedidoActivo] = useState(mockPedidoActivo);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleConfirmarPedido = ({ direccion, medicamentos }) => {
    // TODO: esto se vuelve pedidoApi.crearPedido(...) -- si no hay conexión,
    // se encola en offline/sync/syncQueue.js tal como definimos.
    console.log('Nuevo pedido solicitado:', { direccion, medicamentos });
    setMostrarFormulario(false);
  };

  return (
    <DashboardLayout
      items={pacienteSidebarMenu}
      activeId="pedidos"
      onNavigate={onNavigate}
      usuario={usuario}
      onLogout={onLogout}
    >
      <h1 className={styles.title}>Mis pedidos</h1>
      <p className={styles.subtitle}>
        Revisa el seguimiento de tu entrega actual o solicita una nueva.
      </p>

      <div className={styles.stack}>
        {pedidoActivo && <PedidoActivoCard pedido={pedidoActivo} />}

        {!mostrarFormulario ? (
          <Button onClick={() => setMostrarFormulario(true)}>+ Solicitar nueva entrega</Button>
        ) : (
          <SolicitarPedidoForm
            direccionDefault={direccionPerfil}
            onCancelar={() => setMostrarFormulario(false)}
            onConfirmar={handleConfirmarPedido}
          />
        )}

        <section className={styles.historial}>
          <h2 className={styles.historialTitulo}>Historial de pedidos</h2>
          <div className={styles.historialGrid}>
            {mockHistorialPedidos.map((pedido) => (
              <PedidoHistorialCard key={pedido.id} pedido={pedido} />
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
