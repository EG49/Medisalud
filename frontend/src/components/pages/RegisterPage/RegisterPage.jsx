import { useState } from 'react';
import AuthLayout from '../../templates/AuthLayout/AuthLayout';
import RegisterForm from '../../organisms/RegisterForm/RegisterForm';
import MedicoRegisterForm from '../../organisms/MedicoRegisterForm/MedicoRegisterForm';
import RepartidorRegisterForm from '../../organisms/RepartidorRegisterForm/RepartidorRegisterForm';
import RoleTabs from '../../molecules/RoleTabs/RoleTabs';
import styles from './RegisterPage.module.css';
import { registrarMedico, registrarPaciente, registrarRepartidor } from '../../../api/authApi';

// 'admin' NO está aquí a propósito -- ver la decisión de seguridad:
// esas cuentas se crean por backend/scripts/crear_admin.py, nunca por la web.
export default function RegisterPage({ onRegistroExitoso, goToLogin, onNavigateSection }) {
  const [rol, setRol] = useState('paciente');

  const manejarRegistro = (fnRegistro) => async (datos) => {
    try {
      const usuario = await fnRegistro(datos);
      onRegistroExitoso?.(usuario);
    } catch (error) {
      if (error?.esRed) {
        // Sin backend (demo en GitHub Pages): se simula el registro para
        // poder seguir el recorrido de la app.
        console.warn('Backend no disponible — registro en modo demo.');
        onRegistroExitoso?.({ ...datos, rol, demo: true });
        return;
      }
      alert(error.message || 'No se pudo completar el registro.');
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
