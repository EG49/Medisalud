import styles from './NavLinks.module.css';

const DEFAULT_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: '¿Cómo funciona?', href: '#como-funciona' },
  { label: 'Servicio', href: '#servicio' },
  { label: 'Contactos', href: '#contactos' },
];

export default function NavLinks({ links = DEFAULT_LINKS }) {
  return (
    <nav className={styles.nav} aria-label="Navegación principal">
      <ul className={styles.list}>
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className={styles.link}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
