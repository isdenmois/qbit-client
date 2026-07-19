import type { Page } from '@playwright/test'

export class TorrentContentModal {
  constructor(private readonly page: Page) {}

  async expectOpen(name: string) {
    await this.page.locator(`h2:has-text("${name}")`).waitFor({ state: 'visible' })
  }

  async close() {
    await this.page.locator('.backdrop').click()
  }

  async openFolder(name: string) {
    await this.page.locator(`li.folder:has-text("${name}")`).click()
  }

  async goUp() {
    await this.page.locator('li.up').click()
  }

  async selectFile(name: string) {
    await this.page.locator(`li.file:has-text("${name}")`).click()
  }

  async setPriority(level: 0 | 1 | 7) {
    const index = level === 0 ? 0 : level === 1 ? 1 : 2
    await this.page.locator('.modal [slot="bottom"] button').nth(index).click()
  }
}
