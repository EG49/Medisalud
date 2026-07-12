import Header from '../../organisms/Header/Header';
import Footer from '../../organisms/Footer/Footer';
import styles from './AuthLayout.module.css';

/**
 * Layout compartido por las páginas de autenticación (login, registro).
 * Header y Footer se reusan sin cambios; solo cambia el children central.
 */
export default function AuthLayout({ children, onIngresar, onRegistrarse }) {
  return (
    <div className={styles.page}>
      <Header onIngresar={onIngresar} onRegistrarse={onRegistrarse} />
      <main className={styles.body}>{children}</main>
      <Footer />
    </div>
  );
}
