import { BasePage } from './base.page'

export class LoginPage extends BasePage {
  readonly username = this.page.locator('input[type="text"]')
  readonly password = this.page.locator('input[type="password"]')
  readonly submit = this.page.locator('button[type="submit"]')
  readonly error = this.page.locator('p.error')

  async login(username: string, password: string) {
    await this.username.fill(username)
    await this.password.fill(password)
    await this.submit.click()
  }

  async expectError() {
    await this.error.waitFor({ state: 'visible' })
  }
}
