import styles from './NavLinks.module.css';

const DEFAULT_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: '¿Cómo funciona?', href: '#como-funciona' },
  { label: 'Servicio', href: '#servicio' },
  { label: 'Contactos', href: '#contactos' },
];

/**
 * activeHref: resalta ese link (scroll-spy en la landing).
 * onNavigate(href): si se pasa, se usa en vez del scroll local -- para cuando
 * el Header se muestra en una página SIN esas secciones (ej. Login/Registro),
 * y hay que volver primero a la landing.
 */
export default function NavLinks({ links = DEFAULT_LINKS, activeHref, onNavigate }) {
  const handleClick = (event, href) => {
    if (!href.startsWith('#')) return;
    event.preventDefault();

    if (onNavigate) {
      onNavigate(href);
      return;
    }

    const destino = document.querySelector(href);
    destino?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={styles.nav} aria-label="Navegación principal">
      <ul className={styles.list}>
        {links.map((link) => {
          const isActive = link.href === activeHref;
          return (
            <li key={link.href}>
              <a
                href={link.href}
                className={isActive ? `${styles.link} ${styles.active}` : styles.link}
                aria-current={isActive ? 'page' : undefined}
                onClick={(event) => handleClick(event, link.href)}
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
