import { useEffect } from 'react';
import { Pill, FileText, Stethoscope, Truck } from 'lucide-react';
import DashboardLayout from '../../../templates/DashboardLayout/DashboardLayout';
import MedicineCard from '../../../molecules/MedicineCard/MedicineCard';
import PedidoActivoCard from '../../../molecules/PedidoActivoCard/PedidoActivoCard';
import ExamenCard from '../../../molecules/ExamenCard/ExamenCard';
import QuickAccessCard from '../../../molecules/QuickAccessCard/QuickAccessCard';
import { pacienteSidebarMenu } from '../../../../features/paciente/sidebarMenu';
import { mockRecetas } from '../../../../features/paciente/mockRecetas';
import { mockExamenes } from '../../../../features/paciente/mockExamenes';
import { mockPedidoActivo, mockHistorialPedidos, ESTADOS_PEDIDO } from '../../../../features/paciente/mockPedidos';
import { getExamenes, getPedidos, getRecetas } from '../../../../api/pacienteApi';
import { useApi } from '../../../../api/useApi';
import {
  proximaTomaGeneral,
  estaPorAcabarse,
  calcularDisponible,
} from '../../../../features/paciente/medicineAvailability';
import {
  programarRecordatorio,
  revisarTomasPerdidas,
} from '../../../../offline/notifications/medicineReminders';
import styles from './InicioPage.module.css';

export default function InicioPage({ usuario, onLogout, onNavigate }) {
  // Datos reales del backend; si no hay servidor (demo/offline) usan los mocks.
  const { datos: recetas } = useApi(getRecetas, mockRecetas);
  const { datos: examenes } = useApi(getExamenes, mockExamenes);
  const { datos: pedidos } = useApi(getPedidos, {
    activo: mockPedidoActivo,
    historial: mockHistorialPedidos,
  });

  const itemsRecetas = (recetas ?? []).flatMap((receta) => receta.items);
  const proximaToma = proximaTomaGeneral(itemsRecetas);

  useEffect(() => {
    // Recordatorios locales (offline): revisa si hubo tomas que se pasaron
    // mientras la app estaba cerrada y programa las pendientes. Se reejecuta
    // cuando llegan las recetas del backend.
    if (!itemsRecetas.length) return;
    revisarTomasPerdidas();
    itemsRecetas.forEach((item) => {
      if (item.activa) programarRecordatorio(item);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recetas]);

  const examenMasReciente = [...(examenes ?? [])].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  )[0];

  const pedidoActivo = pedidos?.activo ?? null;

  const medicinasPorAcabarse = itemsRecetas.filter((item) => {
    const { disponible } = calcularDisponible(item);
    return item.activa && estaPorAcabarse(disponible);
  }).length;

  const estadoPedidoLabel = pedidoActivo
    ? ESTADOS_PEDIDO.find((e) => e.id === pedidoActivo.estado)?.label
    : 'Sin pedidos activos';

  return (
    <DashboardLayout
      items={pacienteSidebarMenu}
      activeId="inicio"
      onNavigate={onNavigate}
      usuario={usuario}
      onLogout={onLogout}
    >
      <h1 className={styles.title}>Hola, {usuario?.nombre?.split(' ')[0] ?? 'bienvenido'} 👋</h1>

      <div className={styles.stack}>
        {proximaToma && (
          <section aria-label="Próxima toma">
            <h2 className={styles.seccionTitulo}>Próxima toma</h2>
            <MedicineCard
              receta={proximaToma.item}
              disponible={proximaToma.disponible}
              total={proximaToma.item.cantidadTotal}
              proximaToma={proximaToma.proximaToma}
            />
          </section>
        )}

        <section aria-label={pedidoActivo ? 'Pedido activo' : 'Examen más reciente'}>
          {pedidoActivo ? (
            <PedidoActivoCard pedido={pedidoActivo} />
          ) : (
            examenMasReciente && (
              <>
                <h2 className={styles.seccionTitulo}>Tu examen más reciente</h2>
                <ExamenCard examen={examenMasReciente} />
              </>
            )
          )}
        </section>

        <section aria-label="Accesos rápidos">
          <h2 className={styles.seccionTitulo}>Accesos rápidos</h2>
          <div className={styles.grid}>
            <QuickAccessCard
              icon={Pill}
              titulo="Medicinas"
              dato={
                medicinasPorAcabarse > 0
                  ? `${medicinasPorAcabarse} por acabarse`
                  : 'Todo al día'
              }
              onClick={(e) => onNavigate('medicinas', e)}
            />
            <QuickAccessCard
              icon={FileText}
              titulo="Recetas"
              dato={`${(recetas ?? []).length} activas`}
              onClick={(e) => onNavigate('recetas', e)}
            />
            <QuickAccessCard
              icon={Stethoscope}
              titulo="Exámenes"
              dato={`${(examenes ?? []).length} registrados`}
              onClick={(e) => onNavigate('examenes', e)}
            />
            <QuickAccessCard
              icon={Truck}
              titulo="Pedidos"
              dato={estadoPedidoLabel}
              onClick={(e) => onNavigate('pedidos', e)}
            />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
