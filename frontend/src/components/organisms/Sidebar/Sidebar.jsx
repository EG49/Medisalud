import { LogOut, X } from 'lucide-react';
import styles from './Sidebar.module.css';

/**
 * Sidebar 100% reusable: no sabe qué rol la está usando.
 * Recibe `items` (ya filtrados/armados por el feature del rol correspondiente)
 * y `activeId` para resaltar la sección actual.
 *
 * usuario: { nombre, rol, fotoUrl }
 * isMobileOpen/onCloseMobile: controlan el drawer en pantallas chicas (lo maneja DashboardLayout).
 */
export default function Sidebar({
  items,
  activeId,
  onNavigate,
  usuario,
  onLogout,
  isMobileOpen = false,
  onCloseMobile,
}) {
  const asideClass = [styles.sidebar, isMobileOpen ? styles.open : ''].join(' ').trim();

  return (
    <>
      {isMobileOpen && (
        <div className={styles.backdrop} onClick={onCloseMobile} aria-hidden="true" />
      )}

      <aside className={asideClass} aria-label="Menú principal">
        <div className={styles.header}>
          <span className={styles.brand}>MediSalud</span>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onCloseMobile}
            aria-label="Cerrar menú"
          >
            <X size={22} />
          </button>
        </div>

        <nav className={styles.nav} aria-label="Secciones">
          <ul className={styles.list}>
            {items.map(({ id, label, icon: Icon, href }) => {
              const isActive = id === activeId;
              return (
                <li key={id}>
                  <a
                    href={href}
                    className={isActive ? `${styles.item} ${styles.active}` : styles.item}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(event) => {
                      onNavigate?.(id, event);
                      onCloseMobile?.();
                    }}
                  >
                    <Icon size={24} aria-hidden="true" />
                    <span>{label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.footer}>
          {usuario && (
            <div className={styles.userInfo}>
              {usuario.fotoUrl ? (
                <img src={usuario.fotoUrl} alt="" className={styles.avatar} />
              ) : (
                <div className={styles.avatarPlaceholder} aria-hidden="true">
                  {usuario.nombre?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              <div>
                <p className={styles.userName}>{usuario.nombre}</p>
                <p className={styles.userRole}>{usuario.rol}</p>
              </div>
            </div>
          )}

          <button type="button" className={styles.logoutButton} onClick={onLogout}>
            <LogOut size={20} aria-hidden="true" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
