import path from 'node:path'
import type { Page } from '@playwright/test'

export class AddTorrentModal {
  readonly fileInput: ReturnType<Page['locator']>
  readonly sendButton: ReturnType<Page['locator']>

  constructor(private readonly page: Page) {
    this.fileInput = this.page.locator('input[type="file"]')
    this.sendButton = this.page.locator('button:has-text("Send")')
  }

  async expectOpen() {
    await this.page.locator('h2:has-text("Add a torrent")').waitFor({ state: 'visible' })
  }

  async close() {
    await this.page.locator('.backdrop').click()
  }

  async selectFile(filePath: string) {
    const fileChooser = await this.page.waitForEvent('filechooser')
    await fileChooser.setFiles(path.resolve(filePath))
  }

  async selectCategory(name: string) {
    await this.page.locator(`label:has-text("${name}") input[type="radio"]`).check()
  }

  async submit() {
    await this.sendButton.click()
  }
}
