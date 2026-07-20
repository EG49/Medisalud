import { renderHook, waitFor, act } from '@testing-library/react';
import { useApi } from './useApi';
import { ApiError } from './httpClient';

test('carga datos del backend y modoDemo queda en false', async () => {
  const cargar = jest.fn().mockResolvedValue([{ id: 'r1' }]);
  const { result } = renderHook(() => useApi(cargar, []));

  await waitFor(() => expect(result.current.cargando).toBe(false));
  expect(result.current.datos).toEqual([{ id: 'r1' }]);
  expect(result.current.modoDemo).toBe(false);
  expect(result.current.error).toBeNull();
});

test('si el servidor no responde usa el respaldo y marca modoDemo', async () => {
  const cargar = jest.fn().mockRejectedValue(new ApiError('sin conexión', 0, true));
  const respaldo = [{ id: 'mock-1' }];
  const { result } = renderHook(() => useApi(cargar, respaldo));

  await waitFor(() => expect(result.current.cargando).toBe(false));
  expect(result.current.datos).toEqual(respaldo);
  expect(result.current.modoDemo).toBe(true);
});

test('un 401 (sesión demo sin token) también cae al respaldo', async () => {
  const cargar = jest.fn().mockRejectedValue(new ApiError('sin token', 401));
  const { result } = renderHook(() => useApi(cargar, ['demo']));

  await waitFor(() => expect(result.current.cargando).toBe(false));
  expect(result.current.datos).toEqual(['demo']);
  expect(result.current.modoDemo).toBe(true);
});

test('errores reales del backend (400/500) se exponen como error, sin respaldo', async () => {
  const cargar = jest.fn().mockRejectedValue(new ApiError('algo salió mal', 500));
  const { result } = renderHook(() => useApi(cargar, ['respaldo']));

  await waitFor(() => expect(result.current.cargando).toBe(false));
  expect(result.current.error).toMatchObject({ message: 'algo salió mal' });
  expect(result.current.datos).toBeNull();
});

test('recargar vuelve a pedir los datos', async () => {
  const cargar = jest
    .fn()
    .mockResolvedValueOnce(['v1'])
    .mockResolvedValueOnce(['v2']);
  const { result } = renderHook(() => useApi(cargar, []));

  await waitFor(() => expect(result.current.datos).toEqual(['v1']));
  await act(() => result.current.recargar());
  expect(result.current.datos).toEqual(['v2']);
  expect(cargar).toHaveBeenCalledTimes(2);
});
