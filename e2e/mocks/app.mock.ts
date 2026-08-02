import type { Page } from '@playwright/test'
import { parseForm } from '../utils/parse-form'

export interface Preferences {
  max_active_downloads: number
  max_ratio: number
  max_uploads_per_torrent: number
}

export const preferencesSeed: Preferences = {
  max_active_downloads: 2,
  max_ratio: 3,
  max_uploads_per_torrent: 10,
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
