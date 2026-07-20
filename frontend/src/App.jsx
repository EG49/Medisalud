import { useState } from 'react';
import PublicHomePage from './components/pages/PublicHomePage/PublicHomePage';
import LoginPage from './components/pages/LoginPage/LoginPage';
import RegisterPage from './components/pages/RegisterPage/RegisterPage';
import InicioPage from './components/pages/paciente/InicioPage/InicioPage';
import MedicinasPage from './components/pages/paciente/MedicinasPage/MedicinasPage';
import RecetasPage from './components/pages/paciente/RecetasPage/RecetasPage';
import ExamenesPage from './components/pages/paciente/ExamenesPage/ExamenesPage';
import PedidosPage from './components/pages/paciente/PedidosPage/PedidosPage';
import NotificacionesPage from './components/pages/paciente/NotificacionesPage/NotificacionesPage';
import PerfilPage from './components/pages/paciente/PerfilPage/PerfilPage';
import { cerrarSesion, sesionGuardada } from './api/authApi';

/**
 * Navegación temporal con estado local. Se reemplaza por routes/AppRouter.jsx
 * (react-router) cuando conectemos el resto de roles y rutas protegidas.
 */
const PAGINAS_INTERNAS = {
  inicio: InicioPage,
  medicinas: MedicinasPage,
  recetas: RecetasPage,
  examenes: ExamenesPage,
  pedidos: PedidosPage,
  notificaciones: NotificacionesPage,
  perfil: PerfilPage,
};

export default function App() {
  // Si hay una sesión guardada (PWA: recarga u offline), entra directo al dashboard.
  const sesionInicial = sesionGuardada();

  // 'publico' = landing sin login, es lo primero que ve cualquier visitante.
  const [vista, setVista] = useState(sesionInicial ? 'dashboard' : 'publico');
  const [usuario, setUsuario] = useState(sesionInicial);
  const [paginaActiva, setPaginaActiva] = useState('inicio');
  const [seccionPendiente, setSeccionPendiente] = useState(null);

  const irALandingConSeccion = (href) => {
    setSeccionPendiente(href);
    setVista('publico');
  };

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
    cerrarSesion();
    setUsuario(null);
    setVista('publico');
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
        onNavigateSection={irALandingConSeccion}
      />
    );
  }

  if (vista === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        goToRegistro={() => setVista('registro')}
        onNavigateSection={irALandingConSeccion}
      />
    );
  }

  return (
    <PublicHomePage
      onIngresar={() => setVista('login')}
      onRegistrarse={() => setVista('registro')}
      scrollTargetInicial={seccionPendiente}
    />
  );
}
