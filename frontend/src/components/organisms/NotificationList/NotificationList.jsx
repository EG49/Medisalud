import NotificationItem from '../../molecules/NotificationItem/NotificationItem';
import { agruparPorDia } from '../../../features/paciente/dateGrouping';
import styles from './NotificationList.module.css';

export default function NotificationList({ notificaciones, onLeer }) {
  const grupos = agruparPorDia(notificaciones);

  if (grupos.length === 0) {
    return <p className={styles.vacio}>No tienes notificaciones todavía.</p>;
  }

  return (
    <div className={styles.grupos}>
      {grupos.map((grupo) => (
        <section key={grupo.etiqueta} aria-label={grupo.etiqueta}>
          <h2 className={styles.etiquetaDia}>{grupo.etiqueta}</h2>
          <ul className={styles.lista}>
            {grupo.items.map((notificacion) => (
              <NotificationItem
                key={notificacion.id}
                notificacion={notificacion}
                onLeer={onLeer}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
