import { useEffect, useState } from 'react';

/**
 * true = hay conexión, false = sin conexión.
 * Se actualiza solo cuando el navegador detecta el cambio (eventos
 * online/offline) -- lo usa cualquier pantalla que necesite mostrar
 * "sin conexión, mostrando último dato" (ej. PedidoActivoCard).
 */
export function useConnectionStatus() {
  const [enLinea, setEnLinea] = useState(navigator.onLine);

  useEffect(() => {
    const marcarConectado = () => setEnLinea(true);
    const marcarDesconectado = () => setEnLinea(false);

    window.addEventListener('online', marcarConectado);
    window.addEventListener('offline', marcarDesconectado);

    return () => {
      window.removeEventListener('online', marcarConectado);
      window.removeEventListener('offline', marcarDesconectado);
    };
  }, []);

  return enLinea;
}
