import { useState } from 'react';
import LoginPage from './components/pages/LoginPage/LoginPage';
import RegisterPage from './components/pages/RegisterPage/RegisterPage';
import InicioPage from './components/pages/paciente/InicioPage/InicioPage';

/**
 * Alternancia temporal entre Login/Registro con estado local.
 * Se reemplaza por routes/AppRouter.jsx cuando agreguemos react-router
 * y el resto de pantallas internas por rol.
 */
export default function App() {
  const [vista, setVista] = useState('login');
  const [usuario, setUsuario] = useState(null);

  const handleLoginSuccess = (usuarioAutenticado) => {
    // DEMO: mientras no hay backend real, simulamos el usuario logueado
    setUsuario(usuarioAutenticado ?? { nombre: 'María Fernández', rol: 'paciente' });
    setVista('dashboard');
  };

  const handleRegistroExitoso = (usuario) => {
    // TODO: tras registrarse, decidir si se autologuea o pide verificación
    console.log('Usuario registrado:', usuario);
    setVista('login');
  };

    const handleLogout = () => {
    setUsuario(null);
    setVista('login');
  };
  if (vista === 'dashboard' && usuario) {
    return <InicioPage usuario={usuario} onLogout={handleLogout} />;
  }


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
