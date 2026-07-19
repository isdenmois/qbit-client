import type { Page } from '@playwright/test'

export class TorrentDetailsModal {
  constructor(private readonly page: Page) {}

  async expectOpen(name: string) {
    await this.page.locator(`h2:has-text("${name}")`).waitFor({ state: 'visible' })
  }

  async close() {
    await this.page.locator('.backdrop').click()
  }

  async pause() {
    await this.page.locator('.modal [slot="bottom"] button').first().click()
  }

  async resume() {
    await this.page.locator('.modal [slot="bottom"] button').first().click()
  }

  async delete() {
    await this.page.locator('.modal [slot="bottom"] button.danger').click()
  }

  async expectField(label: string, value: string) {
    await this.page
      .locator('.value')
      .filter({ hasText: value })
      .locator('..')
      .locator(`.title:has-text("${label}")`)
      .waitFor({ state: 'visible' })
  }
}
