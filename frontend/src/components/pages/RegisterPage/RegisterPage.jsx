import AuthLayout from '../../templates/AuthLayout/AuthLayout';
import RegisterForm from '../../organisms/RegisterForm/RegisterForm';
import styles from './RegisterPage.module.css';
import { registrarUsuario } from '../../../api/authApi';

export default function RegisterPage({ onRegistroExitoso, goToLogin, onNavigateSection }) {
  const handleRegistrarse = async (datos) => {
    try {
      const usuario = await registrarUsuario(datos);
      onRegistroExitoso?.(usuario);
    } catch (error) {
      console.error('No se pudo completar el registro', error);
    }
  };

  return (
    <AuthLayout onIngresar={goToLogin} onRegistrarse={() => {}} onNavigateSection={onNavigateSection}>
      <div className={styles.hero}>
        <RegisterForm onRegistrarse={handleRegistrarse} onIrALogin={goToLogin} />
      </div>
    </AuthLayout>
  );
}
