import type { Page } from '@playwright/test'
import { parseForm } from '../utils/parse-form'

export const mockTransferLimits = async (page: Page) => {
  const limits = {
    download: [] as number[],
    upload: [] as number[],
  }

  await page.route('/api/v2/transfer/setDownloadLimit', async (route) => {
    const { limit } = await parseForm(route.request())
    limits.download.push(Number(limit))
    return route.fulfill({ body: 'Ok.' })
  })

  await page.route('/api/v2/transfer/setUploadLimit', async (route) => {
    const { limit } = await parseForm(route.request())
    limits.upload.push(Number(limit))
    return route.fulfill({ body: 'Ok.' })
  })

  return limits
}
