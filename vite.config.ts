import { defineConfig, loadEnv } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
// import { analyzer } from 'vite-bundle-analyzer'
import UnoCSS from 'unocss/vite'
import { presetUno } from 'unocss'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      svelte(),
      UnoCSS({
        presets: [presetUno({ preflight: false })],
      }),
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
    test: {
      environment: 'happy-dom',
      isolate: false,
      fileParallelism: false,
      poolOptions: {
        forks: {
          isolate: false,
        },
      },
      setupFiles: ['@testing-library/svelte/vitest', 'vi-fetch/setup'],
      alias: {
        'svelte-routing': resolve('./src/shared/test/svelte-routing'),
      },
    },
  }
})
