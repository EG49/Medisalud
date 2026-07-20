import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './styles/tokens.css';

// Registra el Service Worker (generado por vite-plugin-pwa).
// autoUpdate: cuando hay una versión nueva deployada, se actualiza sola
// en la siguiente visita — sin pedirle nada al adulto mayor.
registerSW({ immediate: true });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
