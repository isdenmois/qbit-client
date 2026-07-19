# AGENTS.md

Repo-specific guidance for OpenCode sessions working on `qbit-client`.

## Stack

- **Runtime/package manager: `bun`** (lockfile is `bun.lockb`, Dockerfile uses `oven/bun`). Use `bun run <script>` and `bun add`, not npm/yarn.
- Svelte 4 + Vite 5 + UnoCSS. Client-side routing via `svelte-routing`. State via `nanostores`.
- HTTP via `wretch`; all qBittorrent API calls are under `/api/v2` (see `src/shared/api/client.ts`).
- `MIGRATION_PLAN.md` describes a planned Svelte 4 → Vue 3 migration. It is **not started**; the live code is still Svelte 4. Treat the plan as aspirational, not as the current architecture.

## Commands

- `bun run dev` — Vite dev server on `0.0.0.0`. Proxies `/api` → `$VITE_ADDRESS` (defaults to `http://localhost:9990`, set in `.env` / `.env.defaults`).
- `bun run build` — Vite production build to `dist/`.
- `bun run check` — `svelte-check` typecheck using `tsconfig.json` (includes `.svelte`, `.js`, `.ts`; `checkJs: true`).
- `bun run lint` — Biome check (format + lint). `correctness/noUnusedVariables` is `error`.
- `bun run lint:fix` — Biome check with `--write`.
- `bun run format-fix` — Biome format write.
- `bun run test` — Vitest (single run). `bun run test:watch` for watch mode. Single file: `bun run test path/to/file.test.ts`.
- `bun run e2e` — Playwright E2E tests against the production preview build.
- `bun run e2e:ui` — Playwright tests in UI mode.
- `bun run e2e:report` — Open the last Playwright HTML report.
- `bun run e2e:install` — Install Playwright Chromium browsers and deps.
- `bun run deploy` — runs `lint -> check -> test`, then `git push dokku`. Deployment is via Dokku; do not commit/push unless explicitly asked.
  - Note: `deploy` does **not** run Playwright E2E tests.

## Test quirks

### Vitest

- Vitest config in `vite.config.ts`: `isolate: false`, `fileParallelism: false`, `forks.isolate: false`. Tests **share state across files** — do not assume fresh module state per test file; reset stores explicitly.
- `setupFiles: ['@testing-library/svelte/vitest', 'vi-fetch/setup']` — fetch is mocked via `vi-fetch`.
- `svelte-routing` is **aliased to `src/shared/test/svelte-routing`** in tests. Do not import the real router in tests.
- DOM env: `happy-dom`.

### Playwright E2E

- Config: `playwright.config.ts`. Tests live in `e2e/specs/**`. `testDir` is `./e2e`.
- The web server runs `bun run preview --port 4173` against the production build (`dist/`) and waits for `http://localhost:4173`. `VITE_JK_URL` is set to `http://localhost:9999/mock-jk`.
- Two projects run by default: `chromium` (Desktop Chrome) and `mobile-chromium` (Pixel 5). Tests are `fullyParallel`; one worker in CI with two retries.
- Use the project fixture `e2e/fixtures/base.ts` (`import { test } from '../fixtures/base'`). It wraps `@playwright/test` and automatically applies `applyDefaultMocks(page)` before each test.
- API mocking uses `page.route('/api/v2/...')` via helpers in `e2e/mocks/`. The default fixture mocks logged-in state, seeded maindata, categories, torrent actions, transfer limits, torrent add, and empty JK/qB search results.
- Tests follow the Page Object Model: pages are under `e2e/pages/`. Base page: `e2e/pages/base.page.ts`.
- Visual regression specs are in `e2e/specs/visual/` and write to `e2e/screenshots/`. `e2e/screenshots/*` is gitignored except for `.gitkeep`.

## Architecture / paths

- Feature-sliced layout under `src/`: `app`, `pages`, `features`, `entities`, `shared`.
- Vite `resolve.alias` defines only `pages`, `features`, `entities`, `shared`. The `app/` directory is imported via relative paths (no alias). `tsconfig.json` path map `"*": ["./src/*"]` exists for typecheck only, not for Vite resolve — only the four explicit aliases work at build time.
- App entry: `src/app/main.ts` → `src/app/app.svelte` → `src/app/router.svelte`.
- Central data store: `src/entities/stats/model/maindata.ts` — polls `/api/v2/sync/maindata` every 2 s with incremental `rid` updates; merge via the `merge` package. Most pages/components derive from this atom.
- API surface is aggregated in `src/shared/api/index.ts` as `api.{auth,app,jk,search,sync,torrent,transfer}`.

## Conventions

- Biome formatter: `semi: false` (`asNeeded`), `singleQuote: true`, `trailingCommas: 'all'`, `lineWidth: 120`. No semicolons. Svelte files are excluded from Biome formatting/linting.
- Mobile/desktop variants are toggled by setting `document.body.id = 'mobile'` in `src/app/main.ts` (matchMedia `max-width: 639px`); components target `:global(#mobile)`. Don't replace this with media queries without checking existing styling.
- Auth state: a 401/403 from any `wretch` call flips `auth-state` to `'logged-out'` automatically — see `src/shared/api/client.ts`.
