import { useMemo, useState } from 'react';
import DashboardLayout from '../../../templates/DashboardLayout/DashboardLayout';
import BodyDiagram from '../../../organisms/BodyDiagram/BodyDiagram';
import ExamenCard from '../../../molecules/ExamenCard/ExamenCard';
import { pacienteSidebarMenu } from '../../../../features/paciente/sidebarMenu';
import { mockExamenes, contarExamenesPorZona } from '../../../../features/paciente/mockExamenes';
import styles from './ExamenesPage.module.css';

const ETIQUETA_ZONA = {
  cabeza: 'Cabeza',
  torax: 'Tórax',
  abdomen: 'Abdomen',
  brazo_izq: 'Brazo izquierdo',
  brazo_der: 'Brazo derecho',
  pierna_izq: 'Pierna izquierda',
  pierna_der: 'Pierna derecha',
  general: 'General',
};

export default function ExamenesPage({ usuario, onLogout, onNavigate }) {
  // TODO: reemplazar mockExamenes por examenApi.getMisExamenes() cuando exista el backend.
  const [zonaActiva, setZonaActiva] = useState(null);

  const examenes = mockExamenes;
  const conteoPorZona = useMemo(() => contarExamenesPorZona(examenes), [examenes]);

  const examenesFiltrados = zonaActiva
    ? examenes.filter((examen) => examen.zonaCuerpo === zonaActiva)
    : examenes;

  const examenesOrdenados = [...examenesFiltrados].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );

  const zonasConDatos = Object.keys(conteoPorZona);

  return (
    <DashboardLayout
      items={pacienteSidebarMenu}
      activeId="examenes"
      onNavigate={onNavigate}
      usuario={usuario}
      onLogout={onLogout}
    >
      <h1 className={styles.title}>Mis exámenes</h1>
      <p className={styles.subtitle}>
        Toca una zona del cuerpo para filtrar, o revisa la lista completa abajo.
      </p>

      <div className={styles.layout}>
        <div className={styles.diagramaColumna}>
          <BodyDiagram
            conteoPorZona={conteoPorZona}
            zonaActiva={zonaActiva}
            onSelectZona={setZonaActiva}
          />

          {conteoPorZona.general > 0 && (
            <button
              type="button"
              className={
                zonaActiva === 'general'
                  ? `${styles.chipGeneral} ${styles.chipGeneralActivo}`
                  : styles.chipGeneral
              }
              onClick={() => setZonaActiva(zonaActiva === 'general' ? null : 'general')}
            >
              General / Sangre ({conteoPorZona.general})
            </button>
          )}

          {zonaActiva && (
            <button type="button" className={styles.verTodos} onClick={() => setZonaActiva(null)}>
              Ver todos los exámenes
            </button>
          )}
        </div>

        <div className={styles.listaColumna}>
          {zonaActiva && (
            <p className={styles.filtroActivo}>
              Mostrando: <strong>{ETIQUETA_ZONA[zonaActiva]}</strong>
            </p>
          )}

          {examenesOrdenados.length === 0 ? (
            <p className={styles.vacio}>No hay exámenes registrados en esta zona todavía.</p>
          ) : (
            <div className={styles.lista}>
              {examenesOrdenados.map((examen) => (
                <ExamenCard key={examen.id} examen={examen} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
