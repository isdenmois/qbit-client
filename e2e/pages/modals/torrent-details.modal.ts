import { expect, type Page } from '@playwright/test'

export class TorrentDetailsModal {
  constructor(private readonly page: Page) {}

  async expectOpen(name: string) {
    await this.page.locator(`h2:has-text("${name}")`).waitFor({ state: 'visible' })
  }

  async close() {
    await this.page.locator('.backdrop').click()
  }

  async pause() {
    await this.page.locator('.modal .bottom button').first().click()
  }

  async resume() {
    await this.page.locator('.modal .bottom button').first().click()
  }

  async delete() {
    await this.page.locator('.modal .bottom button.danger').click()
  }

  async setDeleteFiles(checked: boolean) {
    const checkbox = this.page.locator('.confirm-dialog .delete-files input[type="checkbox"]')

    if (checked) {
      await checkbox.check()
    } else {
      await checkbox.uncheck()
    }
  }

  async confirmDelete() {
    await this.page.locator('.confirm-dialog .actions button.danger').click()
  }

  async cancelDelete() {
    await this.page.locator('.confirm-dialog .actions button.secondary').click()
  }

  async expectField(label: string, value: string) {
    await this.page
      .locator('.value')
      .filter({ hasText: value })
      .locator('..')
      .locator(`.title:has-text("${label}")`)
      .waitFor({ state: 'visible' })
  }

  async increasePriority() {
    await this.page.locator('button[aria-label="Increase priority"]').click()
  }

  async decreasePriority() {
    await this.page.locator('button[aria-label="Decrease priority"]').click()
  }

  async expectPriority(priority: string) {
    await expect(this.page.locator('.value', { hasText: `#${priority}` })).toBeVisible()
  }
}
