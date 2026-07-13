import Button from '../../atoms/Button/Button';
import NavLinks from '../../molecules/NavLinks/NavLinks';
import styles from './Header.module.css';

/**
 * Header reusable entre landing y páginas internas.
 * onIngresar / onRegistrarse permiten reusarlo aunque cambie la navegación destino.
 */
export default function Header({ onIngresar, onRegistrarse, activeHref, onNavigateSection }) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <img src="/assets/logo-icono.png" alt="" className={styles.logo} />
        <div>
          <p className={styles.brandName}>MediSalud</p>
          <p className={styles.tagline}>Tu salud en buenas manos</p>
        </div>
      </div>

      <NavLinks activeHref={activeHref} onNavigate={onNavigateSection} />

      <div className={styles.actions}>
        <button type="button" className={styles.textAction} onClick={onRegistrarse}>
          Registrarse
        </button>
        <Button onClick={onIngresar}>Ingresar</Button>
      </div>
    </header>
  );
}
