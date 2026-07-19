import styles from './QuickAccessCard.module.css';

export default function QuickAccessCard({ icon: Icon, titulo, dato, onClick }) {
  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <span className={styles.icono} aria-hidden="true">
        <Icon size={28} />
      </span>
      <span className={styles.titulo}>{titulo}</span>
      <span className={styles.dato}>{dato}</span>
    </button>
  );
}
