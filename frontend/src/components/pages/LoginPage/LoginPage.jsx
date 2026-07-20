import AuthLayout from '../../templates/AuthLayout/AuthLayout';
import LoginForm from '../../organisms/LoginForm/LoginForm';
import styles from './LoginPage.module.css';
import { enviarCodigo, iniciarSesion } from '../../../api/authApi';

export default function LoginPage({ onLoginSuccess, goToRegistro, onNavigateSection }) {
  const handleEnviarCodigo = async ({ cedula, celular }) => {
    try {
      await enviarCodigo({ cedula, celular });
    } catch (error) {
      // TODO: mostrar toast de error cuando definamos el sistema de notificaciones UI
      console.error('No se pudo enviar el código', error);
    }
  };

  const handleIniciarSesion = async (credenciales) => {
    try {
      const usuario = await iniciarSesion(credenciales);
      onLoginSuccess?.(usuario);
    } catch (error) {
      console.error('No se pudo iniciar sesión', error);
      // TODO: mostrar el error al usuario (toast/mensaje en el formulario)
      // cuando definamos el sistema de notificaciones de UI para errores.
    }
  };

  return (
    <AuthLayout onIngresar={() => {}} onRegistrarse={goToRegistro} onNavigateSection={onNavigateSection}>
      <div className={styles.hero}>
        <img
          className={styles.illustration}
          src="/assets/abuelo.png"
          alt="Persona adulta mayor sonriendo, usando MediSalud"
        />

        <LoginForm
          onEnviarCodigo={handleEnviarCodigo}
          onIniciarSesion={handleIniciarSesion}
          onRegistrarse={goToRegistro}
        />
      </div>
    </AuthLayout>
  );
}
