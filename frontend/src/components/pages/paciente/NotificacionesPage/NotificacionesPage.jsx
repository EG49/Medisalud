import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import DashboardLayout from '../../../templates/DashboardLayout/DashboardLayout';
import NotificationList from '../../../organisms/NotificationList/NotificationList';
import { pacienteSidebarMenu } from '../../../../features/paciente/sidebarMenu';
import { mockNotificaciones } from '../../../../features/paciente/mockNotificaciones';
import {
  getNotificaciones,
  marcarNotificacionLeida,
  marcarTodasLeidas,
} from '../../../../api/pacienteApi';
import { useApi } from '../../../../api/useApi';
import styles from './NotificacionesPage.module.css';

export default function NotificacionesPage({ usuario, onLogout, onNavigate }) {
  // Datos reales del backend; si no hay servidor (demo/offline) usa los mocks.
  // Los recordatorios de medicina son locales (offline) y se combinan aparte.
  const { datos, modoDemo } = useApi(getNotificaciones, mockNotificaciones);

  const [notificaciones, setNotificaciones] = useState([]);
  useEffect(() => {
    if (datos) setNotificaciones(datos);
  }, [datos]);

  const [permisoPush, setPermisoPush] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  const marcarLeida = (id) => {
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
    if (!modoDemo) {
      marcarNotificacionLeida(id).catch(() => {
        /* actualización optimista: si falla, quedará pendiente hasta recargar */
      });
    }
  };

  const marcarTodas = () => {
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
    if (!modoDemo) {
      marcarTodasLeidas().catch(() => {});
    }
  };

  const activarPush = async () => {
    // Pide permiso real del navegador. La suscripción push completa (guardar
    // el endpoint en el backend) queda para una siguiente iteración.
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
          <button type="button" className={styles.marcarTodas} onClick={marcarTodas}>
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
