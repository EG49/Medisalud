import DashboardLayout from '../../../templates/DashboardLayout/DashboardLayout';
import MedicineCard from '../../../molecules/MedicineCard/MedicineCard';
import { pacienteSidebarMenu } from '../../../../features/paciente/sidebarMenu';
import { mockRecetas } from '../../../../features/paciente/mockRecetas';
import { calcularDisponible, totalTomas } from '../../../../features/paciente/medicineAvailability';
import styles from './MedicinasPage.module.css';

export default function MedicinasPage({ usuario, onLogout, onNavigate }) {
  // TODO: reemplazar mockRecetas por recetaApi.getMisRecetas() cuando exista el backend.
  // La disponibilidad NUNCA viene del servidor como número fijo -- se recalcula
  // siempre en el cliente con calcularDisponible(), tal como definimos.
  const recetas = mockRecetas;

  return (
    <DashboardLayout
      items={pacienteSidebarMenu}
      activeId="medicinas"
      onNavigate={onNavigate}
      usuario={usuario}
      onLogout={onLogout}
    >
      <h1 className={styles.title}>Mis medicinas</h1>
      <p className={styles.subtitle}>
        Aquí ves cuántas dosis te quedan de cada tratamiento y para qué sirve cada una.
      </p>

      <div className={styles.grid}>
        {recetas.map((receta) => {
          const { disponible, proximaToma } = calcularDisponible(receta);
          const total = receta.cantidadTotal ?? totalTomas(receta);

          return (
            <MedicineCard
              key={receta.id}
              receta={receta}
              disponible={disponible}
              total={total}
              proximaToma={proximaToma}
            />
          );
        })}
      </div>
    </DashboardLayout>
  );
}
