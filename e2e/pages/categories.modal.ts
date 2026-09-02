import { BasePage } from './base.page'

export class CategoriesModal extends BasePage {
  readonly manageCategoriesButton = this.page.locator('a:has-text("Manage Categories")')
  readonly addButton = this.page.locator('button:has-text("Add Category")')
  readonly dialog = this.page.locator('.dialog')

  async open() {
    await this.manageCategoriesButton.click()
  }

  async expectOpen() {
    await this.page.locator('h2:has-text("Categories")').waitFor({ state: 'visible' })
  }

  async close() {
    await this.page.locator('button:has-text("Close")').click()
    await this.page.waitForURL('/settings')
  }

  async openAdd() {
    await this.addButton.click()
  }

  async openEdit(name: string) {
    await this.page.locator(`.row:has-text("${name}") button:has-text("Edit")`).click()
  }

  async openDelete(name: string) {
    await this.page.locator(`.row:has-text("${name}") button:has-text("Delete")`).click()
  }

  async fillForm(name: string, savePath: string) {
    if (name !== '') {
      await this.dialog.locator('input').first().fill(name)
    }
    await this.dialog.locator('input').nth(1).fill(savePath)
  }

  async submitForm() {
    await this.dialog.locator('button[type="submit"]').click()
  }

  async confirmDelete() {
    await this.page.locator('.confirm-dialog button:has-text("Delete")').click()
  }

  async expectCategoryVisible(name: string, savePath: string) {
    await this.page.locator(`.row:has-text("${name}") .path:has-text("${savePath}")`).waitFor({ state: 'visible' })
  }

  async expectCategoryHidden(name: string) {
    await this.page.locator(`.row:has-text("${name}")`).waitFor({ state: 'hidden' })
  }
}
