# Svelte 4 → Vue 3 Migration Plan

## 1. Goals

- Convert the **qbit-client** UI from Svelte 4 to **Vue 3 Composition API** (`<script setup>`).
- Keep the runtime/dev stack as **bun + vite + vitest**.
- Preserve existing behavior, styling, and the feature-sliced project structure (`app/entities/features/pages/shared`).

## 2. Current State Inventory

| Area | Current | Notes |
|------|---------|-------|
| Build tool | Vite 5 + `@sveltejs/vite-plugin-svelte` | Also uses UnoCSS. |
| Framework | Svelte 4 + `svelte-routing` | Client-side routing. |
| State | `nanostores` (`atom`/`computed`/`onMount`) | Central store is `entities/stats/model/maindata.ts`. |
| Tests | Vitest + `@testing-library/svelte` + `vi-fetch` + `happy-dom` | 38 `.svelte` files, ~69 `.ts` files. |
| Icons | SVG sprite via `vite-plugin-svelte` raw imports | Imported as module strings; works with Vite. |
| Styling | UnoCSS + global CSS + Svelte scoped styles | Mobile/desktop variants via `:global(#mobile)`. |
| HTTP | `wretch` with addons | API paths are `/api/v2/...`. |

### Svelte files to convert

38 components/pages:

- `app/*` (3): `app.svelte`, `navbar.svelte`, `router.svelte`
- `entities/stats/ui/*` (6)
- `entities/torrents/ui/*` (7)
- `features/limits/ui/*` (4)
- `pages/*` (10)
- `shared/ui/*` (8)

## 3. Target State

| Area | Target |
|------|--------|
| Framework | Vue 3.4+ Composition API (`<script setup>`) |
| Routing | `vue-router` 4 (history mode) |
| State | Vue reactivity (`ref`/`reactive`/`computed`/`watch`) inside composables; optionally Pinia |
| Build | Vite 5 + `@vitejs/plugin-vue` + UnoCSS |
| Tests | Vitest + `@testing-library/vue` + `happy-dom` + custom fetch mock (or `msw`) |

### Important decision: nanostores

**Recommendation: remove it.** Vue's reactivity is a full replacement.

- Convert `entities/stats/model/maindata.ts` to a composable (`useMaindata()`).
- Convert `entities/torrents/model/*.ts` computed stores to plain `computed()` values inside the composable or page components.
- Keep action functions (`resumeTorrent`, `pauseTorrent`, etc.) as plain async functions that mutate a shared `ref`.

If you want to migrate incrementally, you *can* keep `nanostores` and read it via a tiny `useStore()` composable, but it adds a dependency with no benefit.

### Important decision: Biome + Vue

As of mid-2024, **Biome does not lint or format `.vue` SFC files**. It handles `.ts`, `.js`, `.json`, and `.css`.

Recommended setup:

- **Biome**: lint/format all `.ts`, `.js`, `.json`, `.css` (and `.vue` will be ignored).
- **vue-tsc**: type-check `.vue` files (`vue-tsc --noEmit`).
- Optional: keep a minimal ESLint config with `eslint-plugin-vue` **only** for `.vue` files if you want runtime/template lint rules.

If the requirement is strictly "only biome", you will have no linting inside `<template>` blocks. Document this trade-off.

## 4. Migration Phases

### Phase 1 — Toolchain swap

1. Remove Svelte dependencies:

   ```bash
   bun remove svelte svelte-routing @sveltejs/vite-plugin-svelte @tsconfig/svelte \
     svelte-check @testing-library/svelte prettier-plugin-svelte \
     eslint eslint-config-prettier eslint-plugin-svelte \
     @typescript-eslint/eslint-plugin @typescript-eslint/parser \
     prettier vi-fetch
   ```

2. Add Vue/tooling:

   ```bash
   bun add vue vue-router
   bun add -d @vitejs/plugin-vue @vue/test-utils vue-tsc \
     @types/jsdom jsdom
   ```

   (Replace `happy-dom` with `jsdom` if `@vue/test-utils` mount behaves better; keep `happy-dom` if it works.)

3. Update `vite.config.ts`:

   ```ts
   import { defineConfig, loadEnv } from 'vite'
   import vue from '@vitejs/plugin-vue'
   import UnoCSS from 'unocss/vite'
   import { presetUno } from 'unocss'
   import { resolve } from 'node:path'

   export default defineConfig(({ mode }) => {
     const env = loadEnv(mode, process.cwd(), '')
     return {
       plugins: [
         vue(),
         UnoCSS({ presets: [presetUno({ preflight: false })] }),
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
       build: { assetsInlineLimit: 64 },
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
         globals: false,
       },
     }
   })
   ```

4. Update `tsconfig.json`:

   ```json
   {
     "compilerOptions": {
       "target": "ESNext",
       "module": "ESNext",
       "moduleResolution": "bundler",
       "strict": true,
       "jsx": "preserve",
       "sourceMap": true,
       "resolveJsonModule": true,
       "isolatedModules": true,
       "esModuleInterop": true,
       "lib": ["ESNext", "DOM", "DOM.Iterable"],
       "skipLibCheck": true,
       "noEmit": true,
       "paths": {
         "*": ["./src/*"]
       }
     },
     "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
     "references": [{ "path": "./tsconfig.node.json" }]
   }
   ```

### Phase 2 — Shared foundation

1. Convert global CSS files unchanged; they remain under `shared/ui/`.
2. Convert `shared/ui/icons/index.ts` — unchanged, SVG imports remain valid.
3. Convert shared UI components one by one:

   | Svelte | Vue |
   |--------|-----|
   | `export let prop` | `defineProps<{ prop: T }>()` |
   | `<slot />` | `<slot />` |
   | `<slot name="bottom" />` | `<slot name="bottom" />` |
   | `createEventDispatcher` | `defineEmits<{ change: [value: number] }>()` |
   | `bind:files` | `v-model:files` + computed getter/setter |
   | `use:focusOnMount` | custom `v-focus` directive or `ref` + `onMounted` |
   | `{#each arr as item (key)}` | `v-for="item in arr" :key="item.id"` |
   | `{#if}` | `v-if` / `v-else` / `v-else-if` |
   | `{@html html}` | `v-html="html"` |
   | `{#await}` | `Suspense` or explicit `ref`/`watch` |

4. Update `shared/ui/index.ts` to re-export `.vue` files.
5. Update `shared/test` helpers:
   - Remove `svelte-routing` mock.
   - Replace `mockMainData` helper to mutate the new `maindata` ref directly.
   - Create a Vue Router mock for unit tests (or use `createRouter({ history: createMemoryHistory() })`).

### Phase 3 — State layer (nanostores → Vue)

Create a central state composable:

```ts
// src/entities/stats/model/use-maindata.ts
import { ref, computed, onMounted, onUnmounted } from 'vue'
import merge from 'merge'
import { api } from 'shared/api'
import type { MainData, DeepPartial } from 'shared/lib/types'

const maindata = ref<MainData | null>(null)

export function updateMainData(data: DeepPartial<MainData>) {
  maindata.value = merge.recursive(false, maindata.value ?? {}, data)
}

export function useMaindata() {
  onMounted(() => {
    let rid = 0
    let timeoutId: ReturnType<typeof setTimeout>

    const load = async () => {
      try {
        const data = await api.sync.maindata(rid)
        rid = data.rid
        updateMainData(data)
      } catch (error) {
        console.log('Error loading', error)
      }
      timeoutId = setTimeout(load, 2000)
    }

    load()
    onUnmounted(() => clearTimeout(timeoutId))
  })

  return { maindata }
}

export { maindata }
```

Then convert:

- `entities/stats/model/maindata.ts` → use the composable above.
- `entities/torrents/model/torrents.ts` → `useTorrents()` composable returning computed arrays.
- `entities/torrents/model/all-torrents.ts` → `useTorrentsFiltered()`.
- `entities/torrents/model/categories.ts` → `useCategories()`.
- `entities/torrents/model/actions.ts` → plain functions.
- `entities/torrents/model/status.ts` → unchanged.

### Phase 4 — Entities UI

Convert in order:

1. `entities/stats/ui/*` (low complexity, store-driven).
2. `entities/torrents/ui/torrent-info/*` (presentational).
3. `entities/torrents/ui/torrent-item.vue`.

### Phase 5 — Features

Convert `features/limits/ui/*` and `features/limits/model/*`.

### Phase 6 — Router & app shell

Replace `svelte-routing` with `vue-router`.

Current Svelte routing mapping:

```
/                    -> HomePage
/settings            -> SettingsPage
/torrents            -> TorrentsPage
/search              -> SearchPage
/limits              -> Modal -> LimitsPage
/add                 -> Modal -> AddPage
/torrent/:id         -> Modal -> TorrentDetailsPage
/torrent/:id/content -> Modal -> ContentPage
/torrent/:id/category-> Modal -> CategoryPage
```

Vue Router config:

```ts
// src/app/router.ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('pages/home/home-page.vue') },
  { path: '/settings', component: () => import('pages/settings/settings-page.vue') },
  { path: '/torrents', component: () => import('pages/torrents/torrents.page.vue') },
  { path: '/search', component: () => import('pages/search/search-page.vue') },
  { path: '/limits', component: () => import('pages/limits/limits.page.vue'), meta: { modal: true } },
  { path: '/add', component: () => import('pages/add/add.page.vue'), meta: { modal: true } },
  { path: '/torrent/:id', component: () => import('pages/details/torrent-details.vue'), meta: { modal: true } },
  { path: '/torrent/:id/content', component: () => import('pages/content/content.page.vue'), meta: { modal: true } },
  { path: '/torrent/:id/category', component: () => import('pages/details/category-page.vue'), meta: { modal: true } },
]

export const router = createRouter({ history: createWebHistory(), routes })
```

App layout:

```vue
<!-- src/app/app.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, RouterView } from 'vue-router'
import { api } from 'shared/api'
import NavBar from './navbar.vue'
import AppModal from './app-modal.vue'

const router = useRouter()

onMounted(api.auth.init)

const initialized = api.auth.initialized
const isLoggedIn = api.auth.isLoggedIn
</script>

<template>
  <div v-if="isLoggedIn" class="root">
    <NavBar />
    <main>
      <div class="content">
        <RouterView />
        <AppModal />
      </div>
    </main>
  </div>
  <LoginPage v-else-if="initialized" />
  <div v-else class="h-screen flex justify-center items-center">
    <Loading />
  </div>
</template>
```

`app-modal.vue` renders the current modal route inside the existing `Modal` component based on `route.meta.modal`.

Convert `navbar.svelte` → `navbar.vue` using `<router-link>`.
Convert `modal-button.svelte` → use `RouterLink`.

### Phase 7 — Pages

Convert each page:

1. `pages/login/login-page.vue`
2. `pages/home/home-page.vue`
3. `pages/torrents/torrents.page.vue`
4. `pages/search/search-page.vue`
5. `pages/settings/settings-page.vue`
6. `pages/limits/limits.page.vue`
7. `pages/add/add.page.vue`
8. `pages/details/torrent-details.vue`
9. `pages/details/category-page.vue`
10. `pages/content/content.page.vue`

### Phase 8 — Main entry

```ts
// src/app/main.ts
import 'uno.css'
import '@unocss/reset/eric-meyer.css'
import '@dannymichel/proxima-nova'
import 'shared/ui'
import { createApp } from 'vue'
import App from './app.vue'
import { router } from './router'

const mobileQuery = matchMedia('(max-width: 639px)')
const setMobile = () => {
  document.body.id = mobileQuery.matches ? 'mobile' : ''
}
mobileQuery.addEventListener('change', setMobile)
setMobile()

createApp(App).use(router).mount('#app')
```

### Phase 9 — Unit tests

For each converted component, rewrite its test:

```ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Card from './card.vue'

describe('Card', () => {
  it('renders title', () => {
    const wrapper = mount(Card, { props: { title: 'Hello there' } })
    expect(wrapper.find('h2').text()).toBe('Hello there')
  })
})
```

Replace `vi-fetch` with either `msw` in Node or simple `globalThis.fetch` mocks.

### Phase 10 — Biome + validation

1. Add `biome.json`.
2. Run `bun run format-fix` and `bun run lint:fix`.
3. Run `bun run check` (`vue-tsc --noEmit`).
4. Run `bun run test`.
5. Run `bun run test:e2e` and inspect diffs.

## 6. Mapping Common Svelte → Vue Patterns

| Svelte | Vue |
|--------|-----|
| `export let title: string` | `defineProps<{ title: string }>()` |
| `export let value = 0` | `withDefaults(defineProps<{ value?: number }>(), { value: 0 })` |
| `let count = 0` (reactive) | `const count = ref(0)` |
| `$: doubled = count * 2` | `const doubled = computed(() => count.value * 2)` |
| `$: { console.log(x) }` | `watch(x, (val) => console.log(val))` |
| `{#if cond}` | `<div v-if="cond">` |
| `{#each items as item (item.id)}` | `<div v-for="item in items" :key="item.id">` |
| `{#await p then v}` | `const v = ref()` + `onMounted(async () => v.value = await p)` or `<Suspense>` |
| `{@html raw}` | `<div v-html="raw"></div>` |
| `on:click={fn}` | `@click="fn"` |
| `on:limitChange` | `defineEmits(['limitChange'])` + `@limit-change="..."` |
| `bind:value={x}` | `v-model="x"` |
| `bind:files` | custom component emit `update:files` |
| `use:focusOnMount` | directive `v-focus` or `const el = ref()` + `onMounted(() => el.value?.focus())` |
| `<slot />` | `<slot />` |
| `<slot name="bottom" />` | `<slot name="bottom" />` |
| `<style>` scoped | `<style scoped>` |
| `:global(#mobile) .x { }` | `:global(#mobile) .x { }` inside `<style scoped>` |
| `import { navigate } from 'svelte-routing'` | `const router = useRouter(); router.push('/path')` |
| `<Link to="/">` | `<RouterLink to="/">` |

## 7. File-Level Task List

- [ ] Swap toolchain deps, update `vite.config.ts` and `tsconfig.json`.
- [ ] Convert `shared/ui` components.
- [ ] Convert state layer (`maindata`, torrents, categories, filters, actions).
- [ ] Convert `entities/stats/ui` components.
- [ ] Convert `entities/torrents/ui` components.
- [ ] Convert `features/limits` components.
- [ ] Create `vue-router` config and modal layout.
- [ ] Convert `app.vue`, `navbar.vue`, `app-modal.vue`.
- [ ] Convert all pages.
- [ ] Update `src/app/main.ts`.
- [ ] Rewrite unit tests.
- [ ] Run `vue-tsc`, `vitest`, `biome`, Playwright.

## 8. Validation Checklist

Before declaring the migration done, verify:

- [ ] `bun install` succeeds.
- [ ] `bun run dev` starts and the app loads.
- [ ] `bun run check` passes (`vue-tsc --noEmit`).
- [ ] `bun run lint` passes.
- [ ] `bun run test` passes with no failures.
- [ ] `bun run build` produces `dist/` without errors.
- [ ] `bun run test:e2e` passes or diffs are explainable/acceptable.
- [ ] All 38 original Svelte components are deleted.
- [ ] No leftover Svelte config files (`svelte.config.mjs`, `.eslintrc.cjs`, `.prettierrc`).
- [ ] Routing works: home, torrents, search, settings, limits, add, torrent details/content/category.
- [ ] Mobile layout still works (bottom nav + `#mobile` body id).
