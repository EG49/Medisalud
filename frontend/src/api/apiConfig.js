/**
 * Única fuente de la URL base de la API. Vive en su propio módulo porque
 * usa import.meta (sintaxis de Vite): en Jest se mockea completo
 * (ver jest.config.cjs → moduleNameMapper).
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
