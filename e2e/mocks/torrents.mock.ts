import type { Page } from '@playwright/test'
import type { TorrentFile } from '@/shared/api/torrent'

export const mockTorrentProperties = async (page: Page, hash: string, props: { comment: string }) => {
  await page.route(`/api/v2/torrents/properties?hash=${hash}`, (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(props),
    }),
  )
}

export const mockTorrentFiles = async (page: Page, hash: string, files: TorrentFile[]) => {
  await page.route(`/api/v2/torrents/files?hash=${hash}`, (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(files),
    }),
  )
}

export const mockTorrentActions = async (page: Page) => {
  const actions = {
    stop: [] as Record<string, string>[],
    start: [] as Record<string, string>[],
    delete: [] as Record<string, string>[],
    setCategory: [] as Record<string, string>[],
    filePrio: [] as Record<string, string>[],
    increasePrio: [] as Record<string, string>[],
    decreasePrio: [] as Record<string, string>[],
  }

  await page.route('/api/v2/torrents/stop', async (route) => {
    actions.stop.push(parseForm(route.request().postData()))
    return route.fulfill({ body: 'Ok.' })
  })

  await page.route('/api/v2/torrents/start', async (route) => {
    actions.start.push(parseForm(route.request().postData()))
    return route.fulfill({ body: 'Ok.' })
  })

  await page.route('/api/v2/torrents/delete', async (route) => {
    actions.delete.push(parseForm(route.request().postData()))
    return route.fulfill({ body: 'Ok.' })
  })

  await page.route('/api/v2/torrents/setCategory', async (route) => {
    actions.setCategory.push(parseForm(route.request().postData()))
    return route.fulfill({ body: 'Ok.' })
  })

  await page.route('/api/v2/torrents/filePrio', async (route) => {
    actions.filePrio.push(parseForm(route.request().postData()))
    return route.fulfill({ body: 'Ok.' })
  })

  await page.route('/api/v2/torrents/increasePrio', async (route) => {
    actions.increasePrio.push(parseForm(route.request().postData()))
    return route.fulfill({ body: 'Ok.' })
  })

  await page.route('/api/v2/torrents/decreasePrio', async (route) => {
    actions.decreasePrio.push(parseForm(route.request().postData()))
    return route.fulfill({ body: 'Ok.' })
  })

  return actions
}

export interface CategoryActions {
  createCategory: Record<string, string>[]
  editCategory: Record<string, string>[]
  removeCategories: Record<string, string>[]
}

export const mockCategoryActions = async (page: Page): Promise<CategoryActions> => {
  const actions: CategoryActions = {
    createCategory: [],
    editCategory: [],
    removeCategories: [],
  }

  await page.route('/api/v2/torrents/createCategory', async (route) => {
    actions.createCategory.push(parseForm(route.request().postData()))
    return route.fulfill({ body: 'Ok.' })
  })

  await page.route('/api/v2/torrents/editCategory', async (route) => {
    actions.editCategory.push(parseForm(route.request().postData()))
    return route.fulfill({ body: 'Ok.' })
  })

  await page.route('/api/v2/torrents/removeCategories', async (route) => {
    actions.removeCategories.push(parseForm(route.request().postData()))
    return route.fulfill({ body: 'Ok.' })
  })

  return actions
}

export const mockTorrentAdd = async (page: Page, success: boolean = true) => {
  const uploads: { name: string; category: string; filePriorities?: string }[] = []

  await page.route('/api/v2/torrents/add', async (route) => {
    const request = route.request()
    const postData = await request.postDataBuffer()
    const contentType = await request.headerValue('content-type')
    const boundary = contentType?.split('boundary=')[1]

    if (postData && boundary) {
      const text = postData.toString('binary')
      const name = extractField(text, boundary, 'filename') ?? 'unknown'
      const category = extractField(text, boundary, 'name="category"') ?? ''
      const filePriorities = extractField(text, boundary, 'name="filePriorities"') ?? undefined
      uploads.push({ name, category, filePriorities })
    }

    const body = success
      ? { added_torrent_ids: [], failure_count: 0, pending_count: 0, success_count: 1 }
      : { added_torrent_ids: [], failure_count: 1, pending_count: 0, success_count: 0 }

    return route.fulfill({ body: JSON.stringify(body) })
  })

  return uploads
}

export interface ParsedTorrentMetadata {
  comment: string
  created_by: string
  hash: string
  info: {
    files: { length: number; path: string }[]
    length: number
    name: string
    piece_length: number
    pieces_num: number
    private: boolean
  }
  infohash_v1: string
  infohash_v2: string
  trackers: { tier: number; url: string }[]
  webseeds: string[]
}

export const sampleTorrentMetadata: ParsedTorrentMetadata = {
  comment: 'test',
  created_by: 'qBittorrent v5.0',
  hash: 'c63509c9888fc88de0026f721f58c596a511c554',
  info: {
    files: [
      { length: 100, path: 'file 1.txt' },
      { length: 150, path: 'file 2.txt' },
    ],
    length: 250,
    name: 'my files',
    piece_length: 16777216,
    pieces_num: 1,
    private: false,
  },
  infohash_v1: 'c63509c9888fc88de0026f721f58c596a511c554',
  infohash_v2: '',
  trackers: [{ tier: 0, url: 'http://retracker.local/announce' }],
  webseeds: [],
}

export const mockTorrentParseMetadata = async (page: Page, metadata: ParsedTorrentMetadata[] = []) => {
  const parsed = { requests: 0 }

  await page.route('/api/v2/torrents/parseMetadata', async (route) => {
    parsed.requests++
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify(metadata) })
  })

  return parsed
}

const parseForm = (data: string | null): Record<string, string> => {
  if (!data) return {}

  // wretch's FormDataAddon posts multipart/form-data; parse it when a boundary is present.
  const boundaryMatch = data.match(/^--([^\r\n]+)/)
  if (boundaryMatch) {
    const boundary = boundaryMatch[1]
    const params: Record<string, string> = {}

    for (const part of data.split(`--${boundary}`)) {
      const nameMatch = part.match(/name="([^"]+)"/)
      const valueMatch = part.match(/\r\n\r\n([\s\S]*?)\r\n?$/)
      if (nameMatch && valueMatch) {
        params[nameMatch[1]] = valueMatch[1]
      }
    }

    return params
  }

  const search = new URLSearchParams(data)
  return Object.fromEntries(search.entries())
}

const extractField = (body: string, boundary: string, field: string): string | null => {
  const regex = new RegExp(
    `--${boundary}\\r\\nContent-Disposition: form-data;[^\\r\\n]*${field}[^\\r\\n]*\\r\\n\\r\\n([^\\r\\n]+)`,
  )
  const match = body.match(regex)
  return match?.[1] ?? null
}
