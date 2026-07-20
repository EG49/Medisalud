import { Pill, Truck, FileText, Users } from 'lucide-react';
import styles from './NotificationItem.module.css';

const ICONO_POR_TIPO = {
  recordatorio: Pill,
  pedido: Truck,
  receta: FileText,
  cuidador: Users,
};

function tiempoRelativo(isoDate) {
  const minutos = Math.round((Date.now() - new Date(isoDate).getTime()) / 60000);
  if (minutos < 60) return `hace ${Math.max(minutos, 1)} min`;
  const horas = Math.round(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;
  return new Date(isoDate).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
}

export default function NotificationItem({ notificacion, onLeer }) {
  const Icono = ICONO_POR_TIPO[notificacion.tipo] ?? Pill;

  return (
    <li>
      <button
        type="button"
        className={notificacion.leida ? styles.item : `${styles.item} ${styles.noLeida}`}
        onClick={() => onLeer(notificacion.id)}
      >
        <span className={styles.iconoWrapper} aria-hidden="true">
          <Icono size={20} />
        </span>
        <span className={styles.contenido}>
          <span className={styles.mensaje}>{notificacion.mensaje}</span>
          <span className={styles.hora}>{tiempoRelativo(notificacion.fecha)}</span>
        </span>
        {!notificacion.leida && <span className={styles.punto} aria-label="No leída" />}
      </button>
    </li>
  );
}
