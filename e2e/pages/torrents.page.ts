import { BasePage } from './base.page'

export class TorrentsPage extends BasePage {
  readonly heading = this.page.locator('h1:has-text("Torrents")')

  async selectCategory(name: string) {
    await this.page.locator(`button:has-text("${name}")`).click()
  }

  async expectTorrentCount(n: number) {
    await this.page.locator(`h1:has-text("Torrents (${n})")`).waitFor({ state: 'visible' })
  }

  async openTorrent(hash: string) {
    await this.page.locator(`a[href="/torrent/${hash}"]`).click()
  }
}
