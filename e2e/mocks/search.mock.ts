import type { Page } from '@playwright/test'
import type { SearchResults } from 'shared/api/search'

export const mockQbSearch = async (page: Page, data: SearchResults) => {
  await page.route('/api/v2/search/start', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ id: 1 }),
    }),
  )

  await page.route('/api/v2/search/delete', (route) => route.fulfill({ body: 'Ok.' }))

  await page.route('/api/v2/search/status', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify([{ id: 1, status: data.status, total: data.total }]),
    }),
  )

  await page.route('/api/v2/search/results**', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(data),
    }),
  )
}
