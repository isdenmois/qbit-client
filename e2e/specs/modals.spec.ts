import { expect, test } from '@playwright/test'
import { applyDefaultMocks } from '../mocks/handlers'
import { mockTorrentActions, mockTorrentAdd, mockTorrentFiles, mockTorrentProperties } from '../mocks/torrents.mock'
import { mockTransferLimits } from '../mocks/transfer.mock'
import { HomePage } from '../pages/home.page'
import { AddTorrentModal } from '../pages/modals/add-torrent.modal'
import { LimitsModal } from '../pages/modals/limits.modal'
import { TorrentCategoryModal } from '../pages/modals/torrent-category.modal'
import { TorrentContentModal } from '../pages/modals/torrent-content.modal'
import { TorrentDetailsModal } from '../pages/modals/torrent-details.modal'
import { routes } from '../utils/routes'
import { takeModalScreenshot } from '../utils/take-screenshot'

test.beforeEach(async ({ page }) => {
  await applyDefaultMocks(page)
})

test('add torrent: select file, category, submit', async ({ page }) => {
  await mockTorrentAdd(page, 'Ok.')
  const home = new HomePage(page)
  await home.goto('/')

  const modal = new AddTorrentModal(page)

  const selectFile = modal.selectFile('e2e/fixtures/sample.torrent')
  await home.openAddTorrent()
  await modal.expectOpen()
  await selectFile
  await modal.selectCategory('Anime')

  await takeModalScreenshot(page, 'add-torrent')

  await modal.submit()
  await expect(page).toHaveURL('/')
})

test('limits: change download/upload limits', async ({ page }) => {
  // arrange
  const limits = await mockTransferLimits(page)
  await page.goto('/limits')

  const modal = new LimitsModal(page)
  await modal.expectOpen()

  // act
  await modal.setDownloadLimit('5 MB')
  await modal.setUploadLimit('3 MB')

  // assert
  await expect(limits.download).toContain(5 * 1024 * 1024)
  await expect(limits.upload).toContain(3 * 1024 * 1024)
  await takeModalScreenshot(page, 'limits')
})

test('torrent details: pause/resume/delete', async ({ page }) => {
  const actions = await mockTorrentActions(page)
  await mockTorrentProperties(page, '1111111111111111111111111111111111111111', { comment: '' })

  await page.goto(routes.torrentDetails('1111111111111111111111111111111111111111'))

  page.on('dialog', async (dialog) => {
    await dialog.accept()
  })

  const modal = new TorrentDetailsModal(page)
  await modal.expectOpen('Downloading Torrent')

  await modal.pause()
  await page.waitForTimeout(100)
  await expect(actions.stop).toHaveLength(1)

  await modal.resume()
  await page.waitForTimeout(100)
  await expect(actions.start).toHaveLength(1)

  await modal.delete()
  await page.waitForTimeout(100)
  await expect(actions.delete).toHaveLength(1)
})

test('torrent content: navigate folders, change priority', async ({ page }) => {
  const modal = new TorrentContentModal(page)
  await mockTorrentProperties(page, '1111111111111111111111111111111111111111', { comment: '' })
  await mockTorrentFiles(page, '1111111111111111111111111111111111111111', [
    {
      index: 0,
      name: 'Season 1/episode.mkv',
      priority: 1,
      progress: 0.5,
      size: 1_000_000_000,
    },
    {
      index: 1,
      name: 'Season 2/episode.mkv',
      priority: 1,
      progress: 0.5,
      size: 1_000_000_000,
    },
  ])

  await page.goto(routes.torrentContent('1111111111111111111111111111111111111111'))

  await modal.expectOpen('Downloading Torrent')
  await takeModalScreenshot(page, 'torrent-content')

  await modal.openFolder('Season 1')
  await takeModalScreenshot(page, 'torrent-content-dir')

  await modal.selectFile('episode.mkv')
  await modal.setPriority(7)
})

test('torrent category: change category', async ({ page }) => {
  await page.goto(routes.torrentCategory('2222222222222222222222222222222222222222'))

  const modal = new TorrentCategoryModal(page)
  await modal.expectOpen('Completed Torrent')
  await modal.selectCategory('Games')
  await takeModalScreenshot(page, 'torrent-category')
})
