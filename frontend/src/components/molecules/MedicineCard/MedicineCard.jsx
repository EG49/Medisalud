import ProgressBar from '../../atoms/ProgressBar/ProgressBar';
import styles from './MedicineCard.module.css';

/**
 * Tarjeta de una medicina recetada. Recibe la receta ya con `disponible`
 * y `total` calculados (por medicineAvailability.js) -- este componente
 * es puro, no calcula nada.
 */
export default function MedicineCard({ receta, disponible, total, proximaToma }) {
  const { medicamento, indicaciones, activa } = receta;

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.nombre}>{medicamento.nombre}</h3>
          <p className={styles.presentacion}>{medicamento.presentacion}</p>
        </div>
        {!activa && <span className={styles.badgeInactiva}>Tratamiento finalizado</span>}
      </div>

      <p className={styles.uso}>{medicamento.descripcionUso}</p>

      <div className={styles.disponibilidad}>
        <div className={styles.disponibilidadTexto}>
          <span className={styles.cantidad}>{disponible}</span>
          <span className={styles.deTotal}>de {total} disponibles</span>
        </div>
        <ProgressBar
          value={disponible}
          max={total}
          label={`${disponible} de ${total} unidades disponibles de ${medicamento.nombre}`}
        />
      </div>

      <p className={styles.indicaciones}>{indicaciones}</p>

      {proximaToma && (
        <p className={styles.proximaToma}>
          Próxima toma: {proximaToma.toLocaleString('es-EC', {
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      )}
    </article>
  );
}
