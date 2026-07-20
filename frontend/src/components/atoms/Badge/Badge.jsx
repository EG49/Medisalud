import styles from './Badge.module.css';

export default function Badge({ count }) {
  if (!count) return null;
  return <span className={styles.badge}>{count}</span>;
}
