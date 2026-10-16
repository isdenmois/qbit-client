import { expect, test } from '@playwright/test'
import { mockLoggedIn } from '../mocks/auth.mock'
import { maindataSeed, mockMaindata, seedErrorTorrent } from '../mocks/maindata.mock'
import { mockTorrentActions, mockTorrentProperties } from '../mocks/torrents.mock'
import { HomePage } from '../pages/home.page'
import { AddTorrentModal } from '../pages/modals/add-torrent.modal'
import { TorrentDetailsModal } from '../pages/modals/torrent-details.modal'
import { takeModalScreenshot, takeScreenshot } from '../utils/take-screenshot'
import { desktop } from '../utils/viewport'

test.beforeEach(async ({ page }) => {
  await mockLoggedIn(page)
  await mockMaindata(page, maindataSeed())
  await mockTorrentActions(page)
})

test('renders all four stats cards', async ({ page }) => {
  // arrange
  const home = new HomePage(page)

  // act
  await home.goto('/')

  // assert
  await home.expectStatsVisible()
  await home.expectTorrentVisible('Downloading Torrent')
  await takeScreenshot(page, 'home-page')
})

test('lists completed torrents with filters', async ({ page }) => {
  // arrange
  const home = new HomePage(page)
  await home.goto('/')
  await home.expectTorrentVisible('Completed Torrent')

  // act
  await home.toggleFilter('Ratio > 1')

  // assert
  await expect(page.locator('h3:has-text("Completed Torrent")')).toBeVisible()

  await home.toggleFilter('Ratio > 1')
  await home.toggleFilter('Uploading')
  await expect(page.locator('h3:has-text("Completed Torrent")')).toBeVisible()
})

test('filters completed torrents by name', async ({ page }) => {
  // arrange
  const home = new HomePage(page)
  // pin the desktop viewport so the scroll position (and the screenshot) does not depend
  // on the device viewport the project starts with
  await page.setViewportSize(desktop)
  await home.goto('/')
  await home.expectTorrentVisible('Completed Torrent')

  // act
  await home.openSearch()
  await home.searchByName('nonexistent')

  // assert
  await expect(page.locator('h3:has-text("Completed Torrent")')).toHaveCount(0)
  await expect(home.completedSection).toHaveText('Completed (0 / 1)')
  await expect(page.locator('h3:has-text("Downloading Torrent")')).toBeVisible()

  // act
  await home.searchByName('completed')

  // assert
  await expect(page.locator('h3:has-text("Completed Torrent")')).toBeVisible()
  await takeScreenshot(page, 'home-search')

  // act: closing must clear the query, not just hide the input
  await home.searchByName('nonexistent')
  await home.searchButton.click()

  // assert
  await expect(home.searchInput).toHaveCount(0)
  await expect(home.completedSection).toHaveText('Completed (1)')
  await expect(page.locator('h3:has-text("Completed Torrent")')).toBeVisible()
})

test('shows torrents matching no section under Other', async ({ page }) => {
  // arrange
  const seed = maindataSeed()
  seed.torrents['4444444444444444444444444444444444444444'] = seedErrorTorrent(
    '4444444444444444444444444444444444444444',
  )
  await mockMaindata(page, seed)

  const home = new HomePage(page)

  // act
  await home.goto('/')

  // assert
  await expect(home.otherSection).toHaveText('Other (1)')
  await home.expectTorrentVisible('Error Torrent')
})

test('opens add torrent modal via FAB', async ({ page }) => {
  const home = new HomePage(page)
  await home.goto('/')
  await home.openAddTorrent()

  const modal = new AddTorrentModal(page)
  await modal.expectOpen()
})

test('opens torrent details modal when clicking a torrent', async ({ page }) => {
  // arrange
  const home = new HomePage(page)
  const modal = new TorrentDetailsModal(page)
  await mockTorrentProperties(page, '1111111111111111111111111111111111111111', { comment: '' })
  await home.goto('/')

  // act
  await home.openTorrent('1111111111111111111111111111111111111111')

  // assert
  await modal.expectOpen('Downloading Torrent')
  await takeModalScreenshot(page, 'torrent')
})
