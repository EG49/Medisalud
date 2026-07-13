import AuthLayout from '../../templates/AuthLayout/AuthLayout';
import LoginForm from '../../organisms/LoginForm/LoginForm';
import styles from './LoginPage.module.css';
import { enviarCodigo, iniciarSesion } from '../../../api/authApi';

export default function LoginPage({ onLoginSuccess, goToRegistro }) {
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
      // TEMPORAL — quitar cuando exista /api/auth/login en Flask.
      // Mientras tanto, cualquier intento de login entra igual como demo,
      // así se puede ver el Dashboard/Sidebar sin backend real.
      console.warn('Backend no disponible todavía, entrando en modo demo', error);
      onLoginSuccess?.({
        nombre: credenciales.cedula ? `Paciente ${credenciales.cedula}` : 'Usuario demo',
        rol: 'paciente',
      });
    }
  };

  return (
    <AuthLayout onIngresar={() => {}} onRegistrarse={goToRegistro}>
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
