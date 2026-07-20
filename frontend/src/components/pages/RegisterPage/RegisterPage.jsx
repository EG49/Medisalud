import { useState } from 'react';
import AuthLayout from '../../templates/AuthLayout/AuthLayout';
import RegisterForm from '../../organisms/RegisterForm/RegisterForm';
import MedicoRegisterForm from '../../organisms/MedicoRegisterForm/MedicoRegisterForm';
import RepartidorRegisterForm from '../../organisms/RepartidorRegisterForm/RepartidorRegisterForm';
import RoleTabs from '../../molecules/RoleTabs/RoleTabs';
import styles from './RegisterPage.module.css';
import { registrarPaciente, registrarMedico, registrarRepartidor } from '../../../api/authApi';

// 'admin' NO está aquí a propósito -- ver la decisión de seguridad:
// esas cuentas se crean por backend/scripts/crear_admin.py, nunca por la web.
export default function RegisterPage({ onRegistroExitoso, goToLogin, onNavigateSection }) {
  const [rol, setRol] = useState('paciente');

  const manejarRegistro = (fnRegistro) => async (datos) => {
    try {
      const usuario = await fnRegistro(datos);
      onRegistroExitoso?.(usuario);
    } catch (error) {
      console.error('No se pudo completar el registro', error);
      // TODO: mostrar el error al usuario cuando definamos el sistema de
      // notificaciones de UI (mismo TODO que quedó en LoginPage).
    }
  };

  return (
    <AuthLayout onIngresar={goToLogin} onRegistrarse={() => {}} onNavigateSection={onNavigateSection}>
      <div className={styles.hero}>
        <div className={styles.contenedor}>
          <RoleTabs activo={rol} onChange={setRol} />

          {rol === 'paciente' && (
            <RegisterForm onRegistrarse={manejarRegistro(registrarPaciente)} onIrALogin={goToLogin} />
          )}
          {rol === 'medico' && (
            <MedicoRegisterForm onRegistrarse={manejarRegistro(registrarMedico)} onIrALogin={goToLogin} />
          )}
          {rol === 'repartidor' && (
            <RepartidorRegisterForm
              onRegistrarse={manejarRegistro(registrarRepartidor)}
              onIrALogin={goToLogin}
            />
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
