import { expect, test } from '../fixtures/base'
import { LoginPage } from '../pages/login.page'
import { SettingsPage } from '../pages/settings.page'

test('renders logout button', async ({ page }) => {
  // arrange
  const settings = new SettingsPage(page)

  // act
  await settings.goto('/settings')

  // assert
  await expect(settings.logoutButton).toBeVisible()
})

test('clicking logout returns to login', async ({ page }) => {
  // arrange
  const login = new LoginPage(page)
  const settings = new SettingsPage(page)

  await settings.goto('/settings')

  // act
  await settings.logout()

  // assert
  await expect(login.username).toBeVisible()
})
