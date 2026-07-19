import Badge from '../../atoms/Badge/Badge';
import styles from './BodyDiagram.module.css';

const ZONAS = [
  { id: 'cabeza', label: 'Cabeza', top: '8%', left: '50%' },
  { id: 'torax', label: 'Tórax', top: '28%', left: '50%' },
  { id: 'abdomen', label: 'Abdomen', top: '45%', left: '50%' },
  { id: 'brazo_izq', label: 'Brazo izquierdo', top: '32%', left: '22%' },
  { id: 'brazo_der', label: 'Brazo derecho', top: '32%', left: '78%' },
  { id: 'pierna_izq', label: 'Pierna izquierda', top: '78%', left: '38%' },
  { id: 'pierna_der', label: 'Pierna derecha', top: '78%', left: '62%' },
];

/**
 * Diagrama de cuerpo humano como FILTRO/ATAJO visual, no como único acceso
 * (ver decisión de accesibilidad: siempre existe la lista completa debajo,
 * por precisión de toque en personas mayores).
 *
 * conteoPorZona: { torax: 2, abdomen: 1, ... } -- de contarExamenesPorZona()
 */
export default function BodyDiagram({ conteoPorZona, zonaActiva, onSelectZona }) {
  return (
    <div className={styles.wrapper}>
      <svg
        className={styles.silueta}
        viewBox="0 0 200 400"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="100" cy="35" r="28" fill="var(--color-surface-soft)" />
        <rect x="60" y="70" width="80" height="120" rx="24" fill="var(--color-surface-soft)" />
        <rect x="20" y="80" width="34" height="130" rx="16" fill="var(--color-surface-soft)" />
        <rect x="146" y="80" width="34" height="130" rx="16" fill="var(--color-surface-soft)" />
        <rect x="65" y="195" width="30" height="150" rx="15" fill="var(--color-surface-soft)" />
        <rect x="105" y="195" width="30" height="150" rx="15" fill="var(--color-surface-soft)" />
      </svg>

      {ZONAS.map((zona) => {
        const count = conteoPorZona[zona.id] ?? 0;
        const isActive = zonaActiva === zona.id;
        return (
          <button
            key={zona.id}
            type="button"
            className={isActive ? `${styles.punto} ${styles.puntoActivo}` : styles.punto}
            style={{ top: zona.top, left: zona.left }}
            onClick={() => onSelectZona(count > 0 ? zona.id : null)}
            disabled={count === 0}
            aria-pressed={isActive}
          >
            <span className={styles.puntoTexto}>{zona.label}</span>
            <Badge count={count} />
          </button>
        );
      })}
    </div>
  );
}
