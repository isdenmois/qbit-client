import { BasePage } from './base.page'

type AutorunModeLabel = 'Off' | 'Webhook' | 'Custom'

export class AdvancedSettingsModal extends BasePage {
  readonly openButton = this.page.locator('a:has-text("Advanced Settings")')
  readonly modalPage = this.page.locator('.modal').last()
  readonly saveButton = this.modalPage.locator('button[type="submit"]')
  readonly webhookInput = this.modalPage.getByLabel('Webhook URL', { exact: true })
  readonly commandInput = this.modalPage.getByLabel('Custom command', { exact: true })

  private input(label: string) {
    return this.modalPage.getByLabel(label, { exact: true })
  }

  async open() {
    await this.openButton.click()
  }

  async expectOpen() {
    await this.modalPage.locator('h2:has-text("Advanced Settings")').waitFor({ state: 'visible' })
  }

  async expectLoaded() {
    await this.input('Max connections').waitFor({ state: 'visible' })
  }

  async fillNumber(label: string, value: number) {
    await this.input(label).fill(String(value))
  }

  async setChecked(label: string, checked: boolean) {
    await this.input(label).setChecked(checked)
  }

  autorunModeButton(mode: AutorunModeLabel) {
    return this.modalPage.getByRole('button', { name: mode, exact: true })
  }

  async selectAutorunMode(mode: AutorunModeLabel) {
    await this.autorunModeButton(mode).click()
  }

  async fillWebhook(url: string) {
    await this.webhookInput.fill(url)
  }

  async fillCommand(command: string) {
    await this.commandInput.fill(command)
  }

  async save() {
    await this.saveButton.click()
  }

  async close() {
    await this.page.locator('.dialog-backdrop--soft').click()
  }
}
