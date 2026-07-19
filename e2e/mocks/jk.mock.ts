import type { Page } from '@playwright/test'
import type { SearchResult } from 'shared/api/jk'

export const mockJkSearch = async (page: Page, results: SearchResult[]) => {
  await page.route('http://localhost:9999/mock-jk**', (route) => {
    return route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ Results: results }),
    })
  })
}

let guid = 1

export const jkSearchResult = (overrides: Partial<SearchResult> = {}): SearchResult => ({
  Guid: `guid-${guid++}`,
  Details: 'https://example.com/details',
  Title: 'Mock Search Result',
  Link: 'https://example.com/download',
  Seeders: 100,
  Peers: 50,
  PublishDate: '2024-01-15T00:00:00',
  Size: 2_000_000_000,
  Tracker: 'MockTracker',
  ...overrides,
})
