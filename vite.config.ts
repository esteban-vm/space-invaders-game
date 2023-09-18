import { defineConfig, type CommonServerOptions } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { VitePWA } from 'vite-plugin-pwa'

const commonOptions: CommonServerOptions = { open: true, host: true }

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    VitePWA({
      manifest: {
        name: 'Space Invaders Game',
        short_name: 'Space Invaders',
        description: 'Retro themed game made with Vite and Vanilla TypeScript',
        display: 'fullscreen',
        orientation: 'portrait',
        start_url: '/',
        theme_color: '#f0f8ff',
        background_color: '#242424',
        icons: [
          {
            src: '/icons/manifest-icon-192.maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/manifest-icon-192.maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/icons/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      includeAssets: ['/icons/*.png', '/assets/*.png'],
      registerType: 'autoUpdate',
    }),
  ],
  build: { target: 'ESNext' },
  server: { ...commonOptions, port: 5_174 },
  preview: { ...commonOptions, port: 5_175 },
})
