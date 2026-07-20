import AuthLayout from '../../templates/AuthLayout/AuthLayout';
import LoginForm from '../../organisms/LoginForm/LoginForm';
import styles from './LoginPage.module.css';
import { enviarCodigo, iniciarSesion } from '../../../api/authApi';
import { guardarSesion } from '../../../api/httpClient';
import { publicUrl } from '../../../lib/publicUrl';

export default function LoginPage({ onLoginSuccess, goToRegistro, onNavigateSection }) {
  const handleEnviarCodigo = async ({ cedula, celular }) => {
    try {
      await enviarCodigo({ cedula, celular });
    } catch (error) {
      if (error?.esRed) {
        // Sin backend (demo en GitHub Pages): se permite continuar igual.
        console.warn('Backend no disponible — modo demo, cualquier código sirve.');
        return;
      }
      alert(error.message || 'No se pudo enviar el código. Revisa tus datos.');
    }
  };

  const handleIniciarSesion = async (credenciales) => {
    try {
      const usuario = await iniciarSesion(credenciales);
      onLoginSuccess?.(usuario);
    } catch (error) {
      if (error?.esRed) {
        // MODO DEMO: si el servidor no responde (app deployada sin backend),
        // se entra con un usuario de ejemplo y las pantallas usan datos demo.
        const usuarioDemo = { nombre: 'María', apellidos: 'Fernández', rol: 'paciente', demo: true };
        guardarSesion('', usuarioDemo);
        onLoginSuccess?.(usuarioDemo);
        return;
      }
      alert(error.message || 'No se pudo iniciar sesión.');
    }
  };

  return (
    <AuthLayout onIngresar={() => {}} onRegistrarse={goToRegistro} onNavigateSection={onNavigateSection}>
      <div className={styles.hero}>
        <img
          className={styles.illustration}
          src={publicUrl('assets/abuelo.png')}
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
