import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '../../organisms/Sidebar/Sidebar';
import styles from './DashboardLayout.module.css';

/**
 * Layout compartido por todas las páginas internas (post-login), sin importar el rol.
 * items/usuario/activeId/onLogout vienen de la page, que a su vez los arma según
 * el rol autenticado (ej. features/paciente/sidebarMenu.js).
 */
export default function DashboardLayout({
  items,
  activeId,
  onNavigate,
  usuario,
  onLogout,
  badges,
  children,
}) {
  const [isMobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Sidebar
        items={items}
        activeId={activeId}
        onNavigate={onNavigate}
        usuario={usuario}
        onLogout={onLogout}
        badges={badges}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className={styles.contentArea}>
        <div className={styles.mobileTopbar}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={26} />
          </button>
          <span className={styles.mobileBrand}>MediSalud</span>
        </div>

        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
