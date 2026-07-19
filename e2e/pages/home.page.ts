import { routes } from '../utils/routes'
import { BasePage } from './base.page'

export class HomePage extends BasePage {
  readonly speedCard = this.page.locator('.stats-row >> text=Speed')
  readonly limitsCard = this.page.locator('.stats-row >> text=Limits')
  readonly statsCard = this.page.locator('.stats-row >> text=Statistics')
  readonly spaceCard = this.page.locator('.stats-row >> text=Free Space')
  readonly activeSection = this.page.locator('h1:has-text("Active")')
  readonly completedSection = this.page.locator('h1:has-text("Completed")')
  readonly addFab = this.page.locator('.add a')

  async expectStatsVisible() {
    await this.speedCard.waitFor({ state: 'visible' })
    await this.limitsCard.waitFor({ state: 'visible' })
    await this.statsCard.waitFor({ state: 'visible' })
    await this.spaceCard.waitFor({ state: 'visible' })
  }

  async openAddTorrent() {
    await this.addFab.click()
  }

  async openTorrent(hash: string) {
    await this.page.locator(`a[href="${routes.torrentDetails(hash)}"]`).click()
  }

  async toggleFilter(name: string) {
    await this.page.locator(`button:has-text("${name}")`).click()
  }

  async expectTorrentVisible(name: string) {
    await this.page.locator(`h3:has-text("${name}")`).waitFor({ state: 'visible' })
  }
}
