import type { Page } from '@playwright/test'

export class NavBar {
  constructor(private readonly page: Page) {}

  async gotoHome() {
    await this.page.locator('nav a:has-text("Dashboard")').click()
  }

  async gotoSearch() {
    await this.page.locator('nav a:has-text("Search")').click()
  }

  async gotoSettings() {
    await this.page.locator('nav a:has-text("Settings")').click()
  }

  async isVisible() {
    await this.page.locator('nav').waitFor({ state: 'visible' })
  }
}
