import { expect, test } from '../fixtures/base'
import { maindataSeed } from '../mocks/maindata.mock'
import { mockCategoryActions } from '../mocks/torrents.mock'
import { CategoriesModal } from '../pages/categories.modal'
import { SettingsPage } from '../pages/settings.page'
import { takeModalScreenshot } from '../utils/take-screenshot'

const seedCategories = () => ({
  Anime: { name: 'Anime', savePath: '/downloads/anime' },
  Series: { name: 'Series', savePath: '/downloads/series' },
  Games: { name: 'Games', savePath: '/downloads/games' },
})

test('open categories modal from settings', async ({ page }) => {
  // arrange
  const settings = new SettingsPage(page)
  const modal = new CategoriesModal(page)

  await settings.goto('/settings')

  // act
  await modal.open()

  // assert
  await modal.expectOpen()
  await modal.expectCategoryVisible('Anime', '/downloads/anime')
  await modal.expectCategoryVisible('Games', '/downloads/games')

  await takeModalScreenshot(page, 'categories')
})

test('add category', async ({ page }) => {
  // arrange
  const settings = new SettingsPage(page)
  const modal = new CategoriesModal(page)
  const actions = await mockCategoryActions(page)

  await page.route('/api/v2/sync/maindata*', (route) => {
    const categories = seedCategories()
    if (actions.createCategory.length > 0) {
      categories.movies = { name: 'movies', savePath: '/downloads/movies' }
    }
    return route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ ...maindataSeed(), categories }),
    })
  })

  await settings.goto('/settings')

  // act
  await modal.open()
  await modal.openAdd()
  await modal.fillForm('movies', '/downloads/movies')
  await modal.submitForm()

  // assert
  await expect(actions.createCategory).toEqual([{ category: 'movies', savePath: '/downloads/movies' }])
  await modal.expectCategoryVisible('movies', '/downloads/movies')
})

test('edit category save path', async ({ page }) => {
  // arrange
  const settings = new SettingsPage(page)
  const modal = new CategoriesModal(page)
  const actions = await mockCategoryActions(page)

  await page.route('/api/v2/sync/maindata*', (route) => {
    const categories = seedCategories()
    if (actions.editCategory.length > 0) {
      categories.Anime.savePath = '/new/anime/path'
    }
    return route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ ...maindataSeed(), categories }),
    })
  })

  await settings.goto('/settings')

  // act
  await modal.open()
  await modal.openEdit('Anime')
  await modal.fillForm('', '/new/anime/path')
  await modal.submitForm()

  // assert
  await expect(actions.editCategory).toEqual([{ category: 'Anime', savePath: '/new/anime/path' }])
  await modal.expectCategoryVisible('Anime', '/new/anime/path')
})

test('remove category', async ({ page }) => {
  // arrange
  const settings = new SettingsPage(page)
  const modal = new CategoriesModal(page)
  const seed = maindataSeed()
  const actions = await mockCategoryActions(page)

  await page.route('/api/v2/sync/maindata*', (route) => {
    if (seed.categories && actions.removeCategories.length > 0) {
      delete seed.categories.Games
    }
    return route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ ...seed, full_update: true, rid: seed.rid + 1 }),
    })
  })

  await settings.goto('/settings')

  // act
  await modal.open()
  await modal.openDelete('Games')
  await modal.confirmDelete()

  // assert
  await expect(actions.removeCategories).toEqual([{ categories: 'Games' }])
  await modal.expectCategoryHidden('Games')
})
