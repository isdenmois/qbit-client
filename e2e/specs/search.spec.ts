import { expect, test } from '@playwright/test'
import { applyDefaultMocks } from '../mocks/handlers'
import { jkSearchResult, mockJkSearch } from '../mocks/jk.mock'
import { SearchPage } from '../pages/search.page'
import { takeScreenshot } from '../utils/take-screenshot'

test.beforeEach(async ({ page }) => {
  await applyDefaultMocks(page)
})

test('empty search state', async ({ page }) => {
  // arrange
  const search = new SearchPage(page)

  // act
  await search.goto('/search')

  // assert
  await expect(search.queryInput).toBeVisible()
  await takeScreenshot(page, 'search-page')
})

test('submits query and shows results', async ({ page }) => {
  // arrange
  await mockJkSearch(page, [
    jkSearchResult({ Title: 'First Result', Seeders: 50 }),
    jkSearchResult({
      Title: 'Second Result',
      Seeders: 150,
      PublishDate: '2024-02-20T00:00:00',
    }),
  ])

  const search = new SearchPage(page)
  await search.goto('/search')

  // act
  await search.search('mock query')

  // assert
  await search.expectResultCount(2)
  await expect(page.locator('text=First Result')).toBeVisible()
  await expect(page.locator('text=Second Result')).toBeVisible()
  await takeScreenshot(page, 'search-result')
})

test('sorts by date and seeders', async ({ page }) => {
  await mockJkSearch(page, [
    jkSearchResult({
      Title: 'A',
      Seeders: 10,
      PublishDate: '2024-03-01T00:00:00',
    }),
    jkSearchResult({
      Title: 'B',
      Seeders: 100,
      PublishDate: '2024-01-01T00:00:00',
    }),
  ])

  const search = new SearchPage(page)
  await search.goto('/search')
  await search.search('query')

  await search.sortBy('Date')
  await expect(page.locator('ul > li >> nth=0')).toContainText('A')

  await search.sortBy('Seeders')
  await expect(page.locator('ul > li >> nth=0')).toContainText('B')
})
