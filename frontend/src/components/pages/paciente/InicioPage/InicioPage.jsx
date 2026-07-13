import DashboardLayout from '../../../templates/DashboardLayout/DashboardLayout';
import { pacienteSidebarMenu } from '../../../../features/paciente/sidebarMenu';
import styles from './InicioPage.module.css';

export default function InicioPage({ usuario, onLogout, onNavigate }) {
  return (
    <DashboardLayout
      items={pacienteSidebarMenu}
      activeId="inicio"
      onNavigate={onNavigate}
      usuario={usuario}
      onLogout={onLogout}
    >
      <h1 className={styles.title}>Hola, {usuario?.nombre ?? 'bienvenido'} 👋</h1>
      <p className={styles.subtitle}>
        Este es tu espacio. Aquí verás tus próximas tomas de medicina, pedidos en camino
        y accesos rápidos a tu historial.
      </p>
      {/* Contenido real (próxima toma, resumen de pedido, etc.) se arma cuando
          lleguemos a esa pantalla en el plan. */}
    </DashboardLayout>
  );
}
