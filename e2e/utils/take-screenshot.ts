import { expect, type Page } from '@playwright/test'
import { desktop, mobile } from './viewport'

export async function takeScreenshot(page: Page, name: string) {
  await page.setViewportSize(desktop)
  await expect(page).toHaveScreenshot(`${name}-desktop.png`)

  await page.setViewportSize(mobile)
  await expect(page).toHaveScreenshot(`${name}-mobile.png`)
}

export async function takeModalScreenshot(page: Page, name: string) {
  const modal = page.locator('.modal').last()
  await page.setViewportSize(desktop)
  await expect(modal).toHaveScreenshot(`${name}-modal-desktop.png`)

  await page.setViewportSize(mobile)
  await expect(modal).toHaveScreenshot(`${name}-modal-mobile.png`)
}
