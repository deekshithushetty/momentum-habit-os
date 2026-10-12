import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'offline.html',
        'icons/momentum-app-icon.svg',
        'icons/momentum-symbol.svg',
        'icons/favicon-16x16.png',
        'icons/favicon-32x32.png',
        'icons/favicon.png',
        'icons/apple-touch-icon.png',
        'logos/momentum-horizontal-light.svg',
        'logos/momentum-horizontal-dark.svg'
      ],
      manifest: {
        name: 'Momentum - Habit OS',
        short_name: 'Momentum',
        description: 'A premium offline-capable habit tracker.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#0B1220',
        theme_color: '#0B1220',
        icons: [
          { src: '/icons/momentum-app-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: '/icons/momentum-pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/momentum-pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/momentum-maskable-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/momentum-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json}'],
        navigateFallback: '/offline.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkOnly',
            options: { cacheName: 'api-network-only' }
          }
        ]
      }
    })
  ],
  server: { port: 5173 }
});
