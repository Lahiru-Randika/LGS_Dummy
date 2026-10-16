import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],

  build: {
    target: 'esnext',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/leaflet')) {
            return 'vendor-leaflet'
          }
          if (id.includes('node_modules/recharts')) {
            return 'vendor-charts'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons'
          }
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router')) {
            return 'vendor-framework'
          }
        },
      },
    },
  },

  server: {
    port: 5173,

    proxy: {
      /*
        CMC VISIGEO PROXY

        Frontend:
        /cmc/vector/buildings.geojson

        Becomes:
        https://cmc.visigeo.com/vector/buildings.geojson
      */
      '/cmc': {
        target:
          'https://cmc.visigeo.com',

        changeOrigin: true,

        secure: true,

        rewrite: (
          path,
        ) =>
          path.replace(
            /^\/cmc/,
            '',
          ),
      },
    },
  },
})