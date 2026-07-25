import { expect, test } from '../fixtures/base'
import { jkSearchResult, mockJkDownload, mockJkSearch } from '../mocks/jk.mock'
import { AddTorrentModal } from '../pages/modals/add-torrent.modal'
import { SearchPage } from '../pages/search.page'

const TITLE = 'Mock Search Result'
const LINK = 'https://mock-download.test/mock.torrent'

test('right-click a download icon opens /add with the torrent staged', async ({ page }) => {
  const search = new SearchPage(page)
  const modal = new AddTorrentModal(page)

  await mockJkSearch(page, [jkSearchResult({ Title: TITLE, Link: LINK })])
  await mockJkDownload(page, LINK)

  await test.step('open search results', async () => {
    await search.goto('/search')
    await search.search(TITLE)
    await search.expectResultCount(1)
  })

  await search.rightClickDownload(LINK)

  const addPromise = page.waitForRequest((r) => r.url().endsWith('/torrents/add') && r.method() === 'POST')

  await test.step('check and submit add page', async () => {
    await modal.expectOpen()
    await modal.expectFileFilled(`${TITLE}.torrent`)

    await modal.submit()
  })

  await test.step('check that the file was sent', async () => {
    const addRequest = await addPromise
    const body = addRequest.postDataBuffer()?.toString('binary') ?? ''

    expect(body).toContain(`filename="${TITLE}.torrent"`)
  })

  await expect(page).toHaveURL('/')
})
