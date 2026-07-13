import DashboardLayout from '../../../templates/DashboardLayout/DashboardLayout';
import RecetaCard from '../../../molecules/RecetaCard/RecetaCard';
import { pacienteSidebarMenu } from '../../../../features/paciente/sidebarMenu';
import { mockRecetas } from '../../../../features/paciente/mockRecetas';
import styles from './RecetasPage.module.css';

export default function RecetasPage({ usuario, onLogout, onNavigate }) {
  // TODO: reemplazar mockRecetas por recetaApi.getMisRecetas() cuando exista el backend.
  const recetas = [...mockRecetas].sort(
    (a, b) => new Date(b.fechaEmision) - new Date(a.fechaEmision)
  );

  return (
    <DashboardLayout
      items={pacienteSidebarMenu}
      activeId="recetas"
      onNavigate={onNavigate}
      usuario={usuario}
      onLogout={onLogout}
    >
      <h1 className={styles.title}>Mis recetas</h1>
      <p className={styles.subtitle}>
        Tus recetas médicas transcritas y legibles, tal como las emitió cada médico.
      </p>

      <div className={styles.list}>
        {recetas.map((receta) => (
          <RecetaCard key={receta.id} receta={receta} />
        ))}
      </div>
    </DashboardLayout>
  );
}
