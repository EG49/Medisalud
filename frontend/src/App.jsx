import LoginPage from './components/pages/LoginPage/LoginPage';

export default function App() {
  const handleLoginSuccess = (usuario) => {
    // TODO: guardar sesión en context/AuthContext y redirigir según rol
    // (paciente / medico / repartidor / cuidador / admin) cuando armemos el router
    console.log('Usuario autenticado:', usuario);
  };

  return (
    <LoginPage
      onLoginSuccess={handleLoginSuccess}
      goToRegistro={() => console.log('Ir a registro (pendiente)')}
    />
  );
}
