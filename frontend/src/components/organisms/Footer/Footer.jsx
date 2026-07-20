import styles from './Footer.module.css';
import { publicUrl } from '../../../lib/publicUrl';

const SERVICIOS = ['Resultados', 'Recetas', 'Farmacia'];
const INFORMACION = ['Sobre Nosotros', 'Preguntas Frecuentes', 'Privacidad'];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brandBlock}>
          <img src={publicUrl('assets/logo-icono.png')} alt="" className={styles.logoFooter} />
          <p className={styles.brandName}>MediSalud</p>
          <p className={styles.tagline}>Tu salud en buenas manos</p>
        </div>

        <div className={styles.contact}>
          <p className={styles.colTitle}>Contacto</p>
          <p>Tel: 800-123-4567</p>
          <p>ayuda@medisalud.com</p>
          <p>Lun - Vie: 8AM - 6PM</p>
        </div>

        <nav aria-label="Servicios">
          <p className={styles.colTitle}>Servicios</p>
          <ul className={styles.linkList}>
            {SERVICIOS.map((item) => (
              <li key={item}><a href="#">{item}</a></li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Información">
          <p className={styles.colTitle}>Información</p>
          <ul className={styles.linkList}>
            {INFORMACION.map((item) => (
              <li key={item}><a href="#">{item}</a></li>
            ))}
          </ul>
        </nav>
      </div>

      <p className={styles.copyright}>
        © 2026 MediSalud. Todos los derechos reservados.
      </p>
    </footer>
  );
}
