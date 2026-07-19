import { BasePage } from './base.page'

export class SettingsPage extends BasePage {
  readonly logoutButton = this.page.locator('button:has-text("Logout")')

  async logout() {
    await this.logoutButton.click()
  }
}
