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
import { mockPedidoActivo, ESTADOS_PEDIDO } from '../../../../features/paciente/mockPedidos';
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
  // TODO: cada mock aquí se reemplaza por su api/*Api.js correspondiente cuando exista Flask.
  const itemsRecetas = mockRecetas.flatMap((receta) => receta.items);
  const proximaToma = proximaTomaGeneral(itemsRecetas);

  useEffect(() => {
    // Al entrar a Inicio: revisa si hubo tomas que se pasaron mientras la
    // app estaba cerrada, y programa el resto de recordatorios pendientes.
    revisarTomasPerdidas();
    itemsRecetas.forEach((item) => {
      if (item.activa) programarRecordatorio(item);
    });
    // Solo al montar -- no queremos reprogramar en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const examenMasReciente = [...mockExamenes].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  )[0];

  const pedidoActivo = mockPedidoActivo; // null si no hay pedido en curso

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
              dato={`${mockRecetas.length} activas`}
              onClick={(e) => onNavigate('recetas', e)}
            />
            <QuickAccessCard
              icon={Stethoscope}
              titulo="Exámenes"
              dato={`${mockExamenes.length} registrados`}
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
