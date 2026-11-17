import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { configDefaults } from 'vitest/config'

// Baked into the bundle and published as `version.json`, so a running client can
// tell that a newer build has been deployed (see `src/shared/pwa/update-check.ts`).
const version = Date.now().toString(36)

const buildVersion = (id: string): Plugin => ({
  name: 'qbit-client:build-version',
  configureServer(server) {
    server.middlewares.use('/version.json', (_req, res) => {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'no-store')
      res.end(JSON.stringify({ version: id }))
    })
  },
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ version: id }) })
  },
})

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      __APP_VERSION__: JSON.stringify(version),
    },
    plugins: [vue(), UnoCSS(), buildVersion(version)],
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
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    test: {
      environment: 'happy-dom',
      isolate: false,
      globals: true,
      exclude: [...configDefaults.exclude, 'e2e/**'],
      fsModuleCache: true,
    },
  }
})
