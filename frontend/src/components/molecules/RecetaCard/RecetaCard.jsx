import styles from './RecetaCard.module.css';

const formatoFecha = (isoDate) =>
  new Date(isoDate).toLocaleDateString('es-EC', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

/**
 * Muestra la receta ya transcrita/legible -- reemplaza la letra del médico.
 * receta: { medico, hospital, fechaEmision, indicacionesExtra, items[] }
 */
export default function RecetaCard({ receta }) {
  const { medico, hospital, fechaEmision, indicacionesExtra, items } = receta;

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div>
          <p className={styles.medico}>{medico.nombre}</p>
          <p className={styles.especialidad}>{medico.especialidad}</p>
        </div>
        <div className={styles.metaDerecha}>
          <p className={styles.hospital}>{hospital}</p>
          <p className={styles.fecha}>{formatoFecha(fechaEmision)}</p>
        </div>
      </header>

      <ul className={styles.items}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <p className={styles.itemNombre}>
              {item.medicamento.nombre} <span className={styles.presentacion}>({item.medicamento.presentacion})</span>
            </p>
            <p className={styles.dosis}>
              1 unidad cada {item.frecuenciaHoras} horas, durante {item.duracionDias} días
            </p>
            {item.indicaciones && <p className={styles.itemIndicaciones}>{item.indicaciones}</p>}
          </li>
        ))}
      </ul>

      {indicacionesExtra && (
        <footer className={styles.extra}>
          <p className={styles.extraLabel}>Indicaciones adicionales</p>
          <p className={styles.extraTexto}>{indicacionesExtra}</p>
        </footer>
      )}
    </article>
  );
}
