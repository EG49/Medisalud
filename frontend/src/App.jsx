import { useState } from 'react';
import LoginPage from './components/pages/LoginPage/LoginPage';
import RegisterPage from './components/pages/RegisterPage/RegisterPage';

/**
 * Alternancia temporal entre Login/Registro con estado local.
 * Se reemplaza por routes/AppRouter.jsx cuando agreguemos react-router
 * y el resto de pantallas internas por rol.
 */
export default function App() {
  const [vista, setVista] = useState('login');

  const handleLoginSuccess = (usuario) => {
    // TODO: guardar sesión en context/AuthContext y redirigir según rol
    console.log('Usuario autenticado:', usuario);
  };

  const handleRegistroExitoso = (usuario) => {
    // TODO: tras registrarse, decidir si se autologuea o pide verificación
    console.log('Usuario registrado:', usuario);
    setVista('login');
  };

  if (vista === 'registro') {
    return (
      <RegisterPage
        onRegistroExitoso={handleRegistroExitoso}
        goToLogin={() => setVista('login')}
      />
    );
  }

  return (
    <LoginPage
      onLoginSuccess={handleLoginSuccess}
      goToRegistro={() => setVista('registro')}
    />
  );
}
