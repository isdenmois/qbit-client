import { expect, test } from '@playwright/test'
import { mockLoggedOut } from '../mocks/auth.mock'
import { applyDefaultMocks } from '../mocks/handlers'
import { HomePage } from '../pages/home.page'
import { LoginPage } from '../pages/login.page'
import { SettingsPage } from '../pages/settings.page'
import { takeScreenshot } from '../utils/take-screenshot'

test('redirects to login when not authenticated', async ({ page }) => {
  // arrange
  const login = new LoginPage(page)
  await mockLoggedOut(page)

  // act
  await page.goto('/')

  // assert
  await expect(login.username).toBeVisible()
  await expect(login.password).toBeVisible()
  await takeScreenshot(page, 'login-page')
})

test('successful login navigates to home', async ({ page }) => {
  // arrange
  const login = new LoginPage(page)
  const home = new HomePage(page)

  await mockLoggedOut(page)
  await page.goto('/')
  await applyDefaultMocks(page)

  // act
  await login.login('admin', 'admin')

  // assert
  await expect(page).toHaveURL('/')
  await expect(home.activeSection).toBeVisible()
})

test('failed login shows error', async ({ page }) => {
  // arrange
  const login = new LoginPage(page)

  await mockLoggedOut(page)
  await page.goto('/')

  // act
  await login.login('admin', 'wrong')

  // assert
  await login.expectError()
  await takeScreenshot(page, 'login-error')
})

test('logout returns to login', async ({ page }) => {
  // arrange
  const login = new LoginPage(page)
  const settings = new SettingsPage(page)

  await applyDefaultMocks(page)
  await page.goto('/settings')

  // act
  await settings.logout()

  // assert
  await expect(login.username).toBeVisible()
})
