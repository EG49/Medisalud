import styles from './ProgressBar.module.css';

export default function ProgressBar({ value, max, label }) {
  const porcentaje = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
    >
      <div className={styles.fill} style={{ width: `${porcentaje}%` }} />
    </div>
  );
}
