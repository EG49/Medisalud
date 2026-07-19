import styles from './StepCard.module.css';

export default function StepCard({ titulo, descripcion, imagenSrc }) {
  return (
    <article className={styles.card}>
      <h3 className={styles.titulo}>{titulo}</h3>
      <p className={styles.descripcion}>{descripcion}</p>
      <img src={imagenSrc} alt="" className={styles.imagen} />
    </article>
  );
}
