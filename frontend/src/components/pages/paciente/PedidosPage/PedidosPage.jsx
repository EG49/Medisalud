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
import { mockRecetas } from '../../../../features/paciente/mockRecetas';
import { mockPerfil } from '../../../../features/paciente/mockPerfil';
import {
  crearPedido,
  getFarmacias,
  getPedidos,
  getPerfil,
  getRecetas,
} from '../../../../api/pacienteApi';
import { useApi } from '../../../../api/useApi';
import styles from './PedidosPage.module.css';

export default function PedidosPage({ usuario, onLogout, onNavigate }) {
  // Datos reales del backend; si no hay servidor (demo/offline) usan los mocks.
  const {
    datos: pedidos,
    modoDemo,
    recargar,
  } = useApi(getPedidos, { activo: mockPedidoActivo, historial: mockHistorialPedidos });
  const { datos: recetas } = useApi(getRecetas, mockRecetas);
  const { datos: perfil } = useApi(getPerfil, mockPerfil);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const pedidoActivo = pedidos?.activo ?? null;
  const historial = pedidos?.historial ?? [];

  const handleConfirmarPedido = async ({ direccion, medicamentos }) => {
    if (modoDemo) {
      // Sin backend: comportamiento demo, solo cierra el formulario.
      console.log('Pedido demo solicitado:', { direccion, medicamentos });
      setMostrarFormulario(false);
      return;
    }

    setEnviando(true);
    try {
      // El formulario no elige farmacia — usamos la primera del catálogo
      // y como cantidad se repone el tratamiento completo de cada medicina.
      const farmacias = await getFarmacias();
      if (!farmacias.length) throw new Error('No hay farmacias disponibles.');

      await crearPedido({
        direccionEntrega: direccion,
        items: medicamentos.map((item) => ({
          recetaItemId: item.id,
          farmaciaId: farmacias[0].id,
          cantidad: item.cantidadTotal,
        })),
      });
      setMostrarFormulario(false);
      await recargar();
    } catch (error) {
      alert(error.message || 'No se pudo crear el pedido.');
    } finally {
      setEnviando(false);
    }
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
          <Button onClick={() => setMostrarFormulario(true)} disabled={Boolean(pedidoActivo) && !modoDemo}>
            + Solicitar nueva entrega
          </Button>
        ) : (
          <SolicitarPedidoForm
            recetas={recetas ?? []}
            direccionDefault={perfil?.direccion ?? direccionPerfil}
            onCancelar={() => setMostrarFormulario(false)}
            onConfirmar={handleConfirmarPedido}
            deshabilitado={enviando}
          />
        )}

        <section className={styles.historial}>
          <h2 className={styles.historialTitulo}>Historial de pedidos</h2>
          <div className={styles.historialGrid}>
            {historial.map((pedido) => (
              <PedidoHistorialCard key={pedido.id} pedido={pedido} />
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
