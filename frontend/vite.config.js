import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Base de despliegue: '/' en local, '/Medisalud/' en GitHub Pages
// (el workflow de CI define VITE_BASE — ver .github/workflows/ci.yml).
const base = process.env.VITE_BASE || '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/*.png', 'iconos/*.png'],
      manifest: {
        name: 'MediSalud — Salud sin barreras',
        short_name: 'MediSalud',
        description:
          'Telemedicina para el adulto mayor: recetas legibles, medicinas a domicilio y exámenes explicados en lenguaje simple.',
        lang: 'es',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#0d7a6c',
        icons: [
          { src: 'iconos/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'iconos/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'iconos/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precachea todo el build (HTML, JS, CSS e imágenes) → la app abre offline.
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
        navigateFallback: base + 'index.html',
        runtimeCaching: [
          {
            // Datos del paciente: intenta red primero y si no hay conexión
            // responde con la última copia buena (resiliencia offline).
            urlPattern: ({ url }) => url.pathname.includes('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'medisalud-api',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 60, maxAgeSeconds: 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
