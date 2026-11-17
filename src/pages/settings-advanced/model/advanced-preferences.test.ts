import { describe, expect, it } from 'vitest'
import type { Preferences } from '@/shared/api'
import {
  ADVANCED_DEFAULTS,
  type AdvancedForm,
  buildPreferencesPatch,
  isWebhookUrlValid,
  parseAdvancedForm,
  parseWebhookProgram,
  resolveAdvancedPreferences,
  toAdvancedForm,
} from './advanced-preferences'

const formWith = (overrides: Partial<AdvancedForm> = {}): AdvancedForm => ({
  ...toAdvancedForm(ADVANCED_DEFAULTS),
  ...overrides,
})

const loadedPreferences: Preferences = {
  max_active_downloads: 4,
  max_ratio: 3,
  max_uploads_per_torrent: 10,
  max_connec: 500,
  max_connec_per_torrent: 100,
  max_uploads: -1,
  max_active_uploads: 3,
  max_active_torrents: 5,
  async_io_threads: 4,
  queueing_enabled: true,
  autorun_enabled: false,
  autorun_program: '',
}

describe('advanced preferences', () => {
  describe('resolveAdvancedPreferences', () => {
    it('returns qBittorrent defaults when no preferences are loaded', () => {
      // act
      const resolved = resolveAdvancedPreferences(null)

      // assert
      expect(resolved).toEqual(ADVANCED_DEFAULTS)
    })

    it('fills missing keys with defaults and keeps server values', () => {
      // act
      const resolved = resolveAdvancedPreferences({
        ...loadedPreferences,
        max_connec: 750,
        autorun_enabled: true,
        autorun_program: 'notify-send %n',
        async_io_threads: undefined,
      })

      // assert
      expect(resolved.max_connec).toBe(750)
      expect(resolved.autorun_enabled).toBe(true)
      expect(resolved.autorun_program).toBe('notify-send %n')
      expect(resolved.async_io_threads).toBe(ADVANCED_DEFAULTS.async_io_threads)
      expect(resolved.max_uploads).toBe(-1)
    })

    it('falls back to defaults for malformed server values', () => {
      // act
      const resolved = resolveAdvancedPreferences({
        ...loadedPreferences,
        max_connec: Number.NaN,
        autorun_enabled: 'yes' as unknown as boolean,
        autorun_program: 42 as unknown as string,
      })

      // assert
      expect(resolved.max_connec).toBe(ADVANCED_DEFAULTS.max_connec)
      expect(resolved.autorun_enabled).toBe(false)
      expect(resolved.autorun_program).toBe('')
    })
  })

  describe('parseWebhookProgram', () => {
    it('extracts the url from the generated curl command', () => {
      // act / assert
      expect(parseWebhookProgram('curl -X POST "https://example.com/hook"')).toBe('https://example.com/hook')
    })

    it('accepts single quotes and surrounding whitespace', () => {
      // act / assert
      expect(parseWebhookProgram("  curl -X POST 'https://example.com/hook'  ")).toBe('https://example.com/hook')
    })

    it('accepts an unquoted url', () => {
      // act / assert
      expect(parseWebhookProgram('curl -X POST https://example.com/hook')).toBe('https://example.com/hook')
    })

    it('does not treat other commands as webhooks', () => {
      // act / assert
      expect(parseWebhookProgram('notify-send %n')).toBeNull()
      expect(parseWebhookProgram('curl -X POST https://example.com/hook --retry 3')).toBeNull()
      expect(parseWebhookProgram('curl -X GET "https://example.com/hook"')).toBeNull()
    })
  })

  describe('isWebhookUrlValid', () => {
    it('accepts http and https urls', () => {
      // act / assert
      expect(isWebhookUrlValid('https://example.com/hook')).toBe(true)
      expect(isWebhookUrlValid('http://localhost:8080/hook')).toBe(true)
    })

    it('rejects blank, relative, and non-http urls', () => {
      // act / assert
      expect(isWebhookUrlValid('')).toBe(false)
      expect(isWebhookUrlValid('example.com/hook')).toBe(false)
      expect(isWebhookUrlValid('ftp://example.com/hook')).toBe(false)
    })
  })

  describe('toAdvancedForm', () => {
    it('selects Off for disabled autorun and keeps the stored command', () => {
      // act
      const form = toAdvancedForm({
        ...ADVANCED_DEFAULTS,
        autorun_enabled: false,
        autorun_program: 'notify-send %n',
      })

      // assert
      expect(form.autorun_mode).toBe('off')
      expect(form.autorun_command).toBe('notify-send %n')
    })

    it('selects Webhook and extracts the url for a stored webhook', () => {
      // act
      const form = toAdvancedForm({
        ...ADVANCED_DEFAULTS,
        autorun_enabled: true,
        autorun_program: 'curl -X POST "https://hooks.example.com/qbit"',
      })

      // assert
      expect(form.autorun_mode).toBe('webhook')
      expect(form.autorun_webhook).toBe('https://hooks.example.com/qbit')
    })

    it('selects Custom for any other enabled program', () => {
      // act
      const form = toAdvancedForm({
        ...ADVANCED_DEFAULTS,
        autorun_enabled: true,
        autorun_program: 'notify-send %n',
      })

      // assert
      expect(form.autorun_mode).toBe('custom')
      expect(form.autorun_command).toBe('notify-send %n')
    })

    it('falls back to Custom for a webhook-shaped program with an invalid url', () => {
      // act
      const form = toAdvancedForm({
        ...ADVANCED_DEFAULTS,
        autorun_enabled: true,
        autorun_program: 'curl -X POST "ftp://example.com/hook"',
      })

      // assert
      expect(form.autorun_mode).toBe('custom')
      expect(form.autorun_webhook).toBe('')
    })

    it('selects Off for the defaults', () => {
      // act
      const form = toAdvancedForm(ADVANCED_DEFAULTS)

      // assert
      expect(form.autorun_mode).toBe('off')
      expect(form.autorun_webhook).toBe('')
      expect(form.autorun_command).toBe('')
    })
  })

  describe('parseAdvancedForm', () => {
    it('accepts the default form', () => {
      // act
      const parsed = parseAdvancedForm(formWith())

      // assert
      expect(parsed).toEqual(ADVANCED_DEFAULTS)
    })

    it('accepts -1 as unlimited for upload and active counters', () => {
      // act
      const parsed = parseAdvancedForm(
        formWith({
          max_uploads: -1,
          max_uploads_per_torrent: -1,
          max_active_downloads: -1,
          max_active_uploads: -1,
          max_active_torrents: -1,
        }),
      )

      // assert
      expect(parsed?.max_active_downloads).toBe(-1)
      expect(parsed?.max_uploads).toBe(-1)
    })

    it('rejects connection limits below 2', () => {
      // act / assert
      expect(parseAdvancedForm(formWith({ max_connec: 1 }))).toBeNull()
      expect(parseAdvancedForm(formWith({ max_connec_per_torrent: 0 }))).toBeNull()
    })

    it('rejects counters below -1', () => {
      // act / assert
      expect(parseAdvancedForm(formWith({ max_uploads: -2 }))).toBeNull()
      expect(parseAdvancedForm(formWith({ max_active_downloads: -2 }))).toBeNull()
    })

    it('rejects async io threads outside 1-1024', () => {
      // act / assert
      expect(parseAdvancedForm(formWith({ async_io_threads: 0 }))).toBeNull()
      expect(parseAdvancedForm(formWith({ async_io_threads: 1025 }))).toBeNull()
    })

    it('rejects blank and non-integer numeric values', () => {
      // act / assert
      expect(parseAdvancedForm(formWith({ max_connec: '' }))).toBeNull()
      expect(parseAdvancedForm(formWith({ max_connec: 12.5 }))).toBeNull()
    })

    it('disables autorun in Off mode and preserves the command', () => {
      // act
      const parsed = parseAdvancedForm(formWith({ autorun_mode: 'off', autorun_command: 'notify-send %n' }))

      // assert
      expect(parsed?.autorun_enabled).toBe(false)
      expect(parsed?.autorun_program).toBe('notify-send %n')
    })

    it('builds the curl command in Webhook mode', () => {
      // act
      const parsed = parseAdvancedForm(
        formWith({ autorun_mode: 'webhook', autorun_webhook: ' https://example.com/hook ' }),
      )

      // assert
      expect(parsed?.autorun_enabled).toBe(true)
      expect(parsed?.autorun_program).toBe('curl -X POST "https://example.com/hook"')
    })

    it('rejects Webhook mode without a valid url', () => {
      // act / assert
      expect(parseAdvancedForm(formWith({ autorun_mode: 'webhook', autorun_webhook: '' }))).toBeNull()
      expect(parseAdvancedForm(formWith({ autorun_mode: 'webhook', autorun_webhook: 'not-a-url' }))).toBeNull()
    })

    it('requires a command in Custom mode', () => {
      // act / assert
      expect(parseAdvancedForm(formWith({ autorun_mode: 'custom', autorun_command: '  ' }))).toBeNull()
      expect(parseAdvancedForm(formWith({ autorun_mode: 'custom', autorun_command: 'notify-send %n' }))).not.toBeNull()
    })
  })

  describe('buildPreferencesPatch', () => {
    it('returns only the fields that changed', () => {
      // arrange
      const values = {
        ...ADVANCED_DEFAULTS,
        max_connec: 600,
        async_io_threads: 8,
      }

      // act
      const patch = buildPreferencesPatch(values, ADVANCED_DEFAULTS)

      // assert
      expect(patch).toEqual({ max_connec: 600, async_io_threads: 8 })
    })

    it('returns an empty patch when nothing changed', () => {
      // act
      const patch = buildPreferencesPatch(ADVANCED_DEFAULTS, ADVANCED_DEFAULTS)

      // assert
      expect(patch).toEqual({})
    })

    it('sends only the enabled flag when switching a webhook to Off', () => {
      // arrange
      const baseline = {
        ...ADVANCED_DEFAULTS,
        autorun_enabled: true,
        autorun_program: 'curl -X POST "https://example.com/hook"',
      }
      const form = toAdvancedForm(baseline)

      // act
      const values = parseAdvancedForm({ ...form, autorun_mode: 'off' })
      const patch = values ? buildPreferencesPatch(values, baseline) : null

      // assert
      expect(patch).toEqual({ autorun_enabled: false })
    })

    it('sends the generated curl command when switching to Webhook', () => {
      // arrange
      const values = parseAdvancedForm(
        formWith({ autorun_mode: 'webhook', autorun_webhook: 'https://example.com/hook' }),
      )

      // act
      const patch = values ? buildPreferencesPatch(values, ADVANCED_DEFAULTS) : null

      // assert
      expect(patch).toEqual({
        autorun_enabled: true,
        autorun_program: 'curl -X POST "https://example.com/hook"',
      })
    })

    it('sends only the command when the custom command changed', () => {
      // arrange
      const baseline = {
        ...ADVANCED_DEFAULTS,
        autorun_enabled: true,
        autorun_program: 'notify-send old',
      }
      const values = parseAdvancedForm(formWith({ autorun_mode: 'custom', autorun_command: 'notify-send new' }))

      // act
      const patch = values ? buildPreferencesPatch(values, baseline) : null

      // assert
      expect(patch).toEqual({ autorun_program: 'notify-send new' })
    })

    it('includes the queueing toggle when it changed', () => {
      // arrange
      const values = { ...ADVANCED_DEFAULTS, queueing_enabled: false }

      // act
      const patch = buildPreferencesPatch(values, ADVANCED_DEFAULTS)

      // assert
      expect(patch).toEqual({ queueing_enabled: false })
    })
  })
})
