import { defineConfig, loadEnv } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
// import { analyzer } from 'vite-bundle-analyzer'
import UnoCSS from 'unocss/vite'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      svelte(),
      UnoCSS(),
      // analyzer(),
    ],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_ADDRESS,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      assetsInlineLimit: 64,
    },
    resolve: {
      alias: {
        pages: resolve(__dirname, 'src/pages'),
        features: resolve(__dirname, 'src/features'),
        entities: resolve(__dirname, 'src/entities'),
        shared: resolve(__dirname, 'src/shared'),
      },
    },
  }
})
