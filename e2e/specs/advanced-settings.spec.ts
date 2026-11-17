import { expect, test } from '../fixtures/base'
import { mockAppPreferences, preferencesSeed } from '../mocks/app.mock'
import { AdvancedSettingsModal } from '../pages/advanced-settings.modal'
import { SettingsPage } from '../pages/settings.page'

test('open advanced settings from settings', async ({ page }) => {
  // arrange
  const settings = new SettingsPage(page)
  const modal = new AdvancedSettingsModal(page)

  await settings.goto('/settings')

  // act
  await modal.open()

  // assert
  await modal.expectOpen()
  await modal.expectLoaded()
  await expect(page).toHaveURL('/settings/advanced')
  await expect(modal.autorunModeButton('Off')).toHaveAttribute('aria-pressed', 'true')
  await expect(modal.webhookInput).toBeHidden()
  await expect(modal.commandInput).toBeHidden()
  await expect(modal.saveButton).toBeDisabled()
})

test('save only the changed advanced settings', async ({ page }) => {
  // arrange
  const settings = new SettingsPage(page)
  const modal = new AdvancedSettingsModal(page)
  const updates = await mockAppPreferences(page)

  await settings.goto('/settings')

  // act
  await modal.open()
  await modal.expectLoaded()
  await modal.fillNumber('Max connections', 600)
  await modal.setChecked('Enable queueing', false)
  await modal.fillNumber('Async I/O threads', 8)
  await modal.selectAutorunMode('Webhook')
  await expect(modal.webhookInput).toBeVisible()
  await expect(modal.commandInput).toBeHidden()
  await modal.selectAutorunMode('Off')
  await expect(modal.webhookInput).toBeHidden()
  await modal.selectAutorunMode('Webhook')
  await modal.fillWebhook('https://hooks.example.com/qbit')
  await modal.save()

  // assert
  expect(updates).toEqual([
    {
      max_connec: 600,
      queueing_enabled: false,
      async_io_threads: 8,
      autorun_enabled: true,
      autorun_program: 'curl -X POST "https://hooks.example.com/qbit"',
    },
  ])
  await expect(page).toHaveURL('/settings')
})

test('save a custom autorun command', async ({ page }) => {
  // arrange
  const settings = new SettingsPage(page)
  const modal = new AdvancedSettingsModal(page)
  const updates = await mockAppPreferences(page)

  await settings.goto('/settings')

  // act
  await modal.open()
  await modal.expectLoaded()
  await modal.selectAutorunMode('Custom')
  await modal.fillCommand('notify-send %n')
  await modal.save()

  // assert
  expect(updates).toEqual([{ autorun_enabled: true, autorun_program: 'notify-send %n' }])
  await expect(page).toHaveURL('/settings')
})

test('save from a direct link returns to settings', async ({ page }) => {
  // arrange
  const modal = new AdvancedSettingsModal(page)
  const updates = await mockAppPreferences(page)

  await page.goto('/settings/advanced')

  // act
  await modal.expectLoaded()
  await modal.fillNumber('Max uploads', 20)
  await modal.save()

  // assert
  expect(updates).toEqual([{ max_uploads: 20 }])
  await expect(page).toHaveURL('/settings')
})

test('parses an existing webhook into the Webhook tab', async ({ page }) => {
  // arrange
  const settings = new SettingsPage(page)
  const modal = new AdvancedSettingsModal(page)

  await page.route('/api/v2/app/preferences', (route) =>
    route.fulfill({
      json: {
        ...preferencesSeed,
        autorun_enabled: true,
        autorun_program: 'curl -X POST "https://hooks.example.com/existing"',
      },
    }),
  )

  await settings.goto('/settings')

  // act
  await modal.open()
  await modal.expectLoaded()

  // assert
  await expect(modal.autorunModeButton('Webhook')).toHaveAttribute('aria-pressed', 'true')
  await expect(modal.webhookInput).toHaveValue('https://hooks.example.com/existing')
  await expect(modal.commandInput).toBeHidden()
  await expect(modal.saveButton).toBeDisabled()
})
