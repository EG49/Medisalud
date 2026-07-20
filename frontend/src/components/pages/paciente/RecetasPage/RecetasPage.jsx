import DashboardLayout from '../../../templates/DashboardLayout/DashboardLayout';
import RecetaCard from '../../../molecules/RecetaCard/RecetaCard';
import { pacienteSidebarMenu } from '../../../../features/paciente/sidebarMenu';
import { mockRecetas } from '../../../../features/paciente/mockRecetas';
import { getRecetas } from '../../../../api/pacienteApi';
import { useApi } from '../../../../api/useApi';
import styles from './RecetasPage.module.css';

export default function RecetasPage({ usuario, onLogout, onNavigate }) {
  // Datos reales del backend; si no hay servidor (demo/offline) usa los mocks.
  const { datos, cargando } = useApi(getRecetas, mockRecetas);

  const recetas = [...(datos ?? [])].sort(
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
        {cargando && <p role="status">Cargando tus recetas…</p>}
        {!cargando && recetas.length === 0 && (
          <p className={styles.subtitle}>Todavía no tienes recetas registradas.</p>
        )}
        {recetas.map((receta) => (
          <RecetaCard key={receta.id} receta={receta} />
        ))}
      </div>
    </DashboardLayout>
  );
}
