import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook de datos con respaldo offline/demo.
 *
 * const { datos, cargando, error, modoDemo, recargar } = useApi(pacienteApi.getRecetas, mockRecetas);
 *
 * - Intenta cargar del backend real.
 * - Si el servidor no responde (esRed) o no hay sesión válida (401) y se pasó
 *   un `respaldo`, usa el respaldo y marca modoDemo=true. Así la app deployada
 *   sin backend (GitHub Pages) y el modo offline siguen mostrando contenido.
 */
export function useApi(cargar, respaldo) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modoDemo, setModoDemo] = useState(false);

  // Refs para no re-disparar el efecto si el caller pasa funciones/objetos inline.
  const cargarRef = useRef(cargar);
  cargarRef.current = cargar;
  const respaldoRef = useRef(respaldo);
  respaldoRef.current = respaldo;

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await cargarRef.current();
      setDatos(resultado);
      setModoDemo(false);
    } catch (e) {
      const recuperable = e?.esRed || e?.status === 401;
      if (recuperable && respaldoRef.current !== undefined) {
        setDatos(respaldoRef.current);
        setModoDemo(true);
      } else {
        setError(e);
      }
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { datos, cargando, error, modoDemo, recargar };
}
