import { expect, test } from '../fixtures/base'
import { applyDefaultMocks, mockTorrentProperties } from '../mocks/handlers'
import { TorrentDetailsModal } from '../pages/modals/torrent-details.modal'
import { TorrentsPage } from '../pages/torrents.page'

test.beforeEach(async ({ page }) => {
  await applyDefaultMocks(page)
})

test('lists all torrents', async ({ page }) => {
  const torrents = new TorrentsPage(page)
  await torrents.goto('/torrents')
  await torrents.expectTorrentCount(3)
})

test('filters by category chip', async ({ page }) => {
  const torrents = new TorrentsPage(page)
  await torrents.goto('/torrents')
  await torrents.selectCategory('Anime')
  await torrents.expectTorrentCount(1)
  await expect(page.locator('h3:has-text("Completed Torrent")')).toBeVisible()
})

test('opens torrent details', async ({ page }) => {
  await mockTorrentProperties(page, '2222222222222222222222222222222222222222', { comment: '' })

  const torrents = new TorrentsPage(page)
  await torrents.goto('/torrents')
  await torrents.openTorrent('2222222222222222222222222222222222222222')

  const modal = new TorrentDetailsModal(page)
  await modal.expectOpen('Completed Torrent')
})
