import styles from './RoleTabs.module.css';

const OPCIONES = [
  { id: 'paciente', label: 'Paciente' },
  { id: 'medico', label: 'Médico' },
  { id: 'repartidor', label: 'Repartidor' },
];

export default function RoleTabs({ activo, onChange }) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Tipo de cuenta a registrar">
      {OPCIONES.map((opcion) => (
        <button
          key={opcion.id}
          type="button"
          role="tab"
          aria-selected={activo === opcion.id}
          className={activo === opcion.id ? `${styles.tab} ${styles.activo}` : styles.tab}
          onClick={() => onChange(opcion.id)}
        >
          {opcion.label}
        </button>
      ))}
    </div>
  );
}
