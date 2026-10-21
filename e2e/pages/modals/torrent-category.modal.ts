import type { Page } from '@playwright/test'

export class TorrentCategoryModal {
  constructor(private readonly page: Page) {}

  async expectOpen(name: string) {
    await this.page.locator(`h2:has-text("${name}")`).waitFor({ state: 'visible' })
  }

  async close() {
    await this.page.locator('.dialog-backdrop--soft').click()
  }

  async selectCategory(name: string) {
    await this.page.locator(`button:has-text("${name}")`).click()
  }
}
