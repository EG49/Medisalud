import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/logo-icono.png'],
      manifest: {
        name: 'MediSalud',
        short_name: 'MediSalud',
        description: 'Tu salud en buenas manos',
        theme_color: '#4A90E2',
        background_color: '#FFFFFF',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/assets/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/assets/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        // Cachea los archivos de la app (HTML/CSS/JS) para que cargue sin
        // conexión. Los DATOS (recetas, exámenes) van aparte, en
        // offline/cache/db.js con IndexedDB -- este cacheo es solo de la
        // app en sí, no reemplaza esa capa.
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            // Las llamadas a la API nunca se sirven desde caché del SW --
            // si falla la red, que falle de verdad (el manejo de "sin
            // datos frescos" lo hace nuestra propia capa offline/, no esto).
            urlPattern: /\/api\//,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
});
