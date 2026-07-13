import { useState } from 'react';
import LoginPage from './components/pages/LoginPage/LoginPage';
import RegisterPage from './components/pages/RegisterPage/RegisterPage';
import InicioPage from './components/pages/paciente/InicioPage/InicioPage';
import MedicinasPage from './components/pages/paciente/MedicinasPage/MedicinasPage';

/**
 * Navegación temporal con estado local (login / registro / secciones internas).
 * Se reemplaza por routes/AppRouter.jsx (react-router) cuando conectemos
 * el resto de roles y rutas protegidas por sesión.
 */
const PAGINAS_INTERNAS = {
  inicio: InicioPage,
  medicinas: MedicinasPage,
  // recetas, examenes, pedidos, notificaciones, perfil: se agregan a medida
  // que construyamos cada pantalla -- por ahora el sidebar las muestra pero
  // no tienen página propia todavía.
};

export default function App() {
  const [vista, setVista] = useState('login');
  const [usuario, setUsuario] = useState(null);
  const [paginaActiva, setPaginaActiva] = useState('inicio');

  const handleLoginSuccess = (usuarioAutenticado) => {
    setUsuario(usuarioAutenticado ?? { nombre: 'María Fernández', rol: 'paciente' });
    setPaginaActiva('inicio');
    setVista('dashboard');
  };

  const handleRegistroExitoso = (usuario) => {
    console.log('Usuario registrado:', usuario);
    setVista('login');
  };

  const handleLogout = () => {
    setUsuario(null);
    setVista('login');
  };

  const handleNavigate = (id, event) => {
    event?.preventDefault();
    if (PAGINAS_INTERNAS[id]) {
      setPaginaActiva(id);
    } else {
      console.warn(`Pantalla "${id}" todavía no está construida`);
    }
  };

  if (vista === 'dashboard' && usuario) {
    const PaginaActiva = PAGINAS_INTERNAS[paginaActiva] ?? InicioPage;
    return (
      <PaginaActiva usuario={usuario} onLogout={handleLogout} onNavigate={handleNavigate} />
    );
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
