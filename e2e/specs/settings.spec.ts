import { expect, test } from '../fixtures/base'
import { LoginPage } from '../pages/login.page'
import { SettingsPage } from '../pages/settings.page'

test('renders logout button', async ({ page }) => {
  const settings = new SettingsPage(page)
  await settings.goto('/settings')
  await expect(settings.logoutButton).toBeVisible()
})

test('clicking logout returns to login', async ({ page }) => {
  const settings = new SettingsPage(page)
  await settings.goto('/settings')
  await settings.logout()

  const login = new LoginPage(page)
  await expect(login.username).toBeVisible()
})
