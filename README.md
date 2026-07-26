# qbit-client

A lightweight Vue 3 frontend for the qBittorrent Web API.

## Development

- Runtime: [Bun](https://bun.sh)
- Install dependencies: `bun install`
- Start dev server: `bun run dev`
- Run checks: `bun run check`
- Run tests: `bun run test`

## Environment variables

- `VITE_ADDRESS` — qBittorrent API base URL (default: `http://localhost:9990`)
- `VITE_JK_URL` — Jackett/Prowlarr-compatible search backend URL
