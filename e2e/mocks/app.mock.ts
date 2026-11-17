import type { Page } from '@playwright/test'
import { parseForm } from '../utils/parse-form'

export interface Preferences {
  max_active_downloads: number
  max_ratio: number
  max_uploads_per_torrent: number
  max_connec: number
  max_connec_per_torrent: number
  max_uploads: number
  max_active_uploads: number
  max_active_torrents: number
  async_io_threads: number
  queueing_enabled: boolean
  autorun_enabled: boolean
  autorun_program: string
}

export const preferencesSeed: Preferences = {
  max_active_downloads: 2,
  max_ratio: 3,
  max_uploads_per_torrent: 10,
  max_connec: 500,
  max_connec_per_torrent: 100,
  max_uploads: -1,
  max_active_uploads: 3,
  max_active_torrents: 5,
  async_io_threads: 4,
  queueing_enabled: true,
  autorun_enabled: false,
  autorun_program: '',
}

export const mockAppPreferences = async (page: Page) => {
  const updates: Partial<Preferences>[] = []

  await page.route('/api/v2/app/preferences', async (route) => {
    return route.fulfill({ json: preferencesSeed })
  })

  await page.route('/api/v2/app/setPreferences', async (route) => {
    const { json } = await parseForm(route.request())
    updates.push(JSON.parse(json))
    return route.fulfill({ body: 'Ok.' })
  })

  return updates
}
