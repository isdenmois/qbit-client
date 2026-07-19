import { resolve } from 'node:path'
import transformerDirectives from '@unocss/transformer-directives'
import vue from '@vitejs/plugin-vue'
import { presetUno } from 'unocss'
// import { analyzer } from 'vite-bundle-analyzer'
import UnoCSS from 'unocss/vite'
import { defineConfig, loadEnv } from 'vite'
import { configDefaults } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      UnoCSS({
        presets: [presetUno({ preflight: false })],
        transformers: [transformerDirectives()],
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
      globals: true,
      exclude: [...configDefaults.exclude, 'e2e/**'],
    },
  }
})
