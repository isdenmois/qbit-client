import { BasePage } from './base.page'

export class SearchPage extends BasePage {
  readonly queryInput = this.page.locator('form input[type="text"]')
  readonly seedersSort = this.page.locator('button:has-text("Seeders")')
  readonly dateSort = this.page.locator('button:has-text("Date")')

  async search(query: string) {
    await this.queryInput.fill(query)
    await this.queryInput.press('Enter')
  }

  async expectResultCount(n: number) {
    await this.page.locator(`h3:has-text("Found ${n}")`).waitFor({ state: 'visible' })
  }

  async sortBy(name: 'Seeders' | 'Date') {
    await this.page.locator(`button:has-text("${name}")`).click()
  }
}
