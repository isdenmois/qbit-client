import type { Page } from '@playwright/test'

export class LimitsModal {
  constructor(private readonly page: Page) {}

  get modalPage() {
    return this.page.locator('.modal').last()
  }

  async expectOpen() {
    await this.modalPage.locator('h2:has-text("Limits")').waitFor({ state: 'visible' })
  }

  async close() {
    await this.page.locator('.backdrop').click()
  }

  async setDownloadLimit(value: string) {
    await this.modalPage.locator(`button:has-text("${value}")`).first().click()
  }

  async setUploadLimit(value: string) {
    await this.modalPage.locator(`button:has-text("${value}")`).nth(1).click()
  }
}
