import DashboardLayout from '../../../templates/DashboardLayout/DashboardLayout';
import MedicineCard from '../../../molecules/MedicineCard/MedicineCard';
import { pacienteSidebarMenu } from '../../../../features/paciente/sidebarMenu';
import { mockRecetas } from '../../../../features/paciente/mockRecetas';
import { calcularDisponible, totalTomas } from '../../../../features/paciente/medicineAvailability';
import styles from './MedicinasPage.module.css';

export default function MedicinasPage({ usuario, onLogout, onNavigate }) {
  // TODO: reemplazar mockRecetas por recetaApi.getMisRecetas() cuando exista el backend.
  // Cada receta (documento) puede traer varios medicamentos (items) --
  // aquí los aplanamos porque esta pantalla es "por medicina", no "por documento".
  const items = mockRecetas.flatMap((receta) => receta.items);

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
        {items.map((item) => {
          const { disponible, proximaToma } = calcularDisponible(item);
          const total = item.cantidadTotal ?? totalTomas(item);

          return (
            <MedicineCard
              key={item.id}
              receta={item}
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
