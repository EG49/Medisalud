import { Store } from 'lucide-react';
import styles from './FarmaciaBadge.module.css';

export default function FarmaciaBadge({ farmacia }) {
  return (
    <span className={styles.badge}>
      <Store size={14} aria-hidden="true" />
      {farmacia.nombre}
    </span>
  );
}
