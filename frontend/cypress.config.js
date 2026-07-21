import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.js',
    video: false,
    env: {
      // URL del backend Flask que corre junto a las pruebas (ver ci.yml)
      apiUrl: 'http://127.0.0.1:5000/api',
    },
  },
});
