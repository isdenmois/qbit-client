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

  private section(label: string) {
    return this.modalPage.locator(`div:has(> p:has-text("${label}"))`)
  }

  async setDownloadLimit(value: string) {
    await this.modalPage.locator(`button:has-text("${value}")`).first().click()
  }

  async setUploadLimit(value: string) {
    await this.modalPage.locator(`button:has-text("${value}")`).nth(1).click()
  }

  async setMaxActiveDownloads(value: string) {
    await this.section('Max active downloads').locator(`button:has-text("${value}")`).click()
  }

  async setMaxRatio(value: string) {
    await this.section('Max ratio').locator(`button:has-text("${value}")`).click()
  }
}
