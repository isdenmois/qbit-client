import type { Page } from '@playwright/test'

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string) {
    await this.page.goto(path)
  }

  async expectToastNotPresent() {
    await this.page.waitForTimeout(100)
  }
}
