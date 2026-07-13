import { useState } from 'react';
import { Bell } from 'lucide-react';
import DashboardLayout from '../../../templates/DashboardLayout/DashboardLayout';
import NotificationList from '../../../organisms/NotificationList/NotificationList';
import { pacienteSidebarMenu } from '../../../../features/paciente/sidebarMenu';
import { mockNotificaciones } from '../../../../features/paciente/mockNotificaciones';
import styles from './NotificacionesPage.module.css';

export default function NotificacionesPage({ usuario, onLogout, onNavigate }) {
  // TODO: reemplazar mockNotificaciones por la combinación real:
  // offline/notifications/medicineReminders.js (local) + GET /api/paciente/notificaciones (servidor)
  const [notificaciones, setNotificaciones] = useState(mockNotificaciones);
  const [permisoPush, setPermisoPush] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  const marcarLeida = (id) => {
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
  };

  const marcarTodasLeidas = () => {
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  const activarPush = async () => {
    // Pide permiso real del navegador. La suscripción real (guardar el
    // endpoint en el backend para poder enviar push) se conecta cuando
    // exista Flask -- por ahora solo deja el permiso listo.
    if (typeof Notification === 'undefined') return;
    const resultado = await Notification.requestPermission();
    setPermisoPush(resultado);
  };

  return (
    <DashboardLayout
      items={pacienteSidebarMenu}
      activeId="notificaciones"
      onNavigate={onNavigate}
      usuario={usuario}
      onLogout={onLogout}
      badges={{ notificaciones: noLeidas }}
    >
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Notificaciones</h1>
          <p className={styles.subtitle}>
            Recordatorios de medicina, tus pedidos y novedades de tus médicos.
          </p>
        </div>
        {noLeidas > 0 && (
          <button type="button" className={styles.marcarTodas} onClick={marcarTodasLeidas}>
            Marcar todo como leído
          </button>
        )}
      </div>

      {permisoPush !== 'granted' && typeof Notification !== 'undefined' && (
        <div className={styles.pushAviso}>
          <Bell size={22} aria-hidden="true" />
          <span>Activa las notificaciones para enterarte aunque no tengas la app abierta.</span>
          <button type="button" className={styles.pushBoton} onClick={activarPush}>
            Activar
          </button>
        </div>
      )}

      <NotificationList notificaciones={notificaciones} onLeer={marcarLeida} />
    </DashboardLayout>
  );
}
