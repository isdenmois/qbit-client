import type { Page } from '@playwright/test'
import type { TorrentFile } from '@/shared/api/torrent'

export interface CategoryInput {
  name: string
  savePath: string
}

export const mockCategories = async (page: Page, categories: Record<string, CategoryInput>) => {
  await page.route('/api/v2/torrents/categories', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(categories),
    }),
  )
}

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

  return actions
}

export const mockTorrentAdd = async (page: Page, result: 'Ok.' | 'Fails.' = 'Ok.') => {
  const uploads: { name: string; category: string }[] = []

  await page.route('/api/v2/torrents/add', async (route) => {
    const request = route.request()
    const postData = await request.postDataBuffer()
    const contentType = await request.headerValue('content-type')
    const boundary = contentType?.split('boundary=')[1]

    if (postData && boundary) {
      const text = postData.toString('binary')
      const name = extractField(text, boundary, 'filename') ?? 'unknown'
      const category = extractField(text, boundary, 'name="category"') ?? ''
      uploads.push({ name, category })
    }

    return route.fulfill({ body: result })
  })

  return uploads
}

const parseForm = (data: string | null): Record<string, string> => {
  const params = new URLSearchParams(data ?? '')
  return Object.fromEntries(params.entries())
}

const extractField = (body: string, boundary: string, field: string): string | null => {
  const regex = new RegExp(
    `--${boundary}\\r\\nContent-Disposition: form-data;[^\\r\\n]*${field}[^\\r\\n]*\\r\\n\\r\\n([^\\r\\n]+)`,
  )
  const match = body.match(regex)
  return match?.[1] ?? null
}
