import path from 'node:path'
import type { Page } from '@playwright/test'

export class AddTorrentModal {
  readonly fileInput: ReturnType<Page['locator']>
  readonly sendButton: ReturnType<Page['locator']>
  readonly prioritiesCheckbox: ReturnType<Page['locator']>
  readonly backButton: ReturnType<Page['locator']>

  constructor(private readonly page: Page) {
    this.fileInput = this.page.locator('input[type="file"]')
    this.sendButton = this.page.locator('button:has-text("Send")')
    this.prioritiesCheckbox = this.page.locator(
      'label:has-text("Select priorities before creation") input[type="checkbox"]',
    )
    this.backButton = this.page.getByRole('button', { name: 'Back to form' })
  }

  async expectOpen() {
    await this.page.locator('h2:has-text("Add a torrent")').waitFor({ state: 'visible' })
  }

  async expectFileFilled(name: string) {
    await this.page.locator('.modal').last().getByText(name).waitFor({ state: 'visible' })
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

  async checkPriorities() {
    await this.prioritiesCheckbox.check()
  }

  async expectExplorer(name: string) {
    await this.page.locator(`h2:has-text("${name}")`).waitFor({ state: 'visible' })
  }

  async expectForm() {
    await this.expectOpen()
  }

  async backToForm() {
    await this.backButton.click()
  }

  async selectExplorerFile(name: string) {
    await this.page.locator(`li.file:has-text("${name}")`).click()
  }

  async skipSelection() {
    await this.page.getByRole('button', { name: 'Skip file' }).click()
  }

  async submit() {
    await this.sendButton.click()
  }
}
