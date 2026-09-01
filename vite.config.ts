import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],

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