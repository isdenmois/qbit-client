import type { Preferences } from '@/shared/api/app'

export const NUMERIC_RULES = {
  max_connec: { min: 2, max: 2147483647 },
  max_connec_per_torrent: { min: 2, max: 2147483647 },
  max_uploads: { min: -1, max: 2147483647 },
  max_uploads_per_torrent: { min: -1, max: 2147483647 },
  max_active_downloads: { min: -1, max: 2147483647 },
  max_active_uploads: { min: -1, max: 2147483647 },
  max_active_torrents: { min: -1, max: 2147483647 },
  async_io_threads: { min: 1, max: 1024 },
} as const

export type NumericPreferenceKey = keyof typeof NUMERIC_RULES

export type AutorunMode = 'off' | 'webhook' | 'custom'

export type AdvancedValues = { [K in NumericPreferenceKey]: number } & {
  queueing_enabled: boolean
  autorun_enabled: boolean
  autorun_program: string
}

export type AdvancedForm = { [K in NumericPreferenceKey]: number | '' } & {
  queueing_enabled: boolean
  autorun_mode: AutorunMode
  autorun_webhook: string
  autorun_command: string
}

export const NUMERIC_FIELDS = Object.keys(NUMERIC_RULES) as NumericPreferenceKey[]

export const ADVANCED_DEFAULTS: AdvancedValues = {
  max_connec: 500,
  max_connec_per_torrent: 100,
  max_uploads: -1,
  max_uploads_per_torrent: -1,
  max_active_downloads: 3,
  max_active_uploads: 3,
  max_active_torrents: 5,
  async_io_threads: 4,
  queueing_enabled: true,
  autorun_enabled: false,
  autorun_program: '',
}

const numberOr = (value: unknown, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const booleanOr = (value: unknown, fallback: boolean) => (typeof value === 'boolean' ? value : fallback)

const stringOr = (value: unknown, fallback: string) => (typeof value === 'string' ? value : fallback)

export const resolveAdvancedPreferences = (preferences: Preferences | null): AdvancedValues => {
  if (!preferences) return { ...ADVANCED_DEFAULTS }

  return {
    max_connec: numberOr(preferences.max_connec, ADVANCED_DEFAULTS.max_connec),
    max_connec_per_torrent: numberOr(preferences.max_connec_per_torrent, ADVANCED_DEFAULTS.max_connec_per_torrent),
    max_uploads: numberOr(preferences.max_uploads, ADVANCED_DEFAULTS.max_uploads),
    max_uploads_per_torrent: numberOr(preferences.max_uploads_per_torrent, ADVANCED_DEFAULTS.max_uploads_per_torrent),
    max_active_downloads: numberOr(preferences.max_active_downloads, ADVANCED_DEFAULTS.max_active_downloads),
    max_active_uploads: numberOr(preferences.max_active_uploads, ADVANCED_DEFAULTS.max_active_uploads),
    max_active_torrents: numberOr(preferences.max_active_torrents, ADVANCED_DEFAULTS.max_active_torrents),
    async_io_threads: numberOr(preferences.async_io_threads, ADVANCED_DEFAULTS.async_io_threads),
    queueing_enabled: booleanOr(preferences.queueing_enabled, ADVANCED_DEFAULTS.queueing_enabled),
    autorun_enabled: booleanOr(preferences.autorun_enabled, ADVANCED_DEFAULTS.autorun_enabled),
    autorun_program: stringOr(preferences.autorun_program, ADVANCED_DEFAULTS.autorun_program),
  }
}

export const isNumericValueValid = (key: NumericPreferenceKey, value: number | ''): value is number => {
  if (typeof value !== 'number' || !Number.isInteger(value)) return false

  const { min, max } = NUMERIC_RULES[key]
  return value >= min && value <= max
}

const WEBHOOK_PATTERN = /^curl\s+-X\s+POST\s+(?:"([^"]+)"|'([^']+)'|(\S+))$/

export const parseWebhookProgram = (program: string): string | null => {
  const match = program.trim().match(WEBHOOK_PATTERN)
  if (!match) return null

  return (match[1] ?? match[2] ?? match[3]).trim()
}

export const isWebhookUrlValid = (value: string): boolean => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export const toAdvancedForm = (values: AdvancedValues): AdvancedForm => {
  const { autorun_enabled, autorun_program, ...rest } = values
  const parsedWebhook = parseWebhookProgram(autorun_program)
  const webhookUrl = parsedWebhook !== null && isWebhookUrlValid(parsedWebhook) ? parsedWebhook : null

  return {
    ...rest,
    autorun_mode: !autorun_enabled ? 'off' : webhookUrl !== null ? 'webhook' : 'custom',
    autorun_webhook: webhookUrl ?? '',
    autorun_command: autorun_program,
  }
}

const parseAutorun = (form: AdvancedForm): Pick<AdvancedValues, 'autorun_enabled' | 'autorun_program'> | null => {
  if (form.autorun_mode === 'off') {
    return { autorun_enabled: false, autorun_program: form.autorun_command }
  }

  if (form.autorun_mode === 'webhook') {
    const url = form.autorun_webhook.trim()
    if (!isWebhookUrlValid(url)) return null
    return { autorun_enabled: true, autorun_program: `curl -X POST "${url}"` }
  }

  if (form.autorun_command.trim() === '') return null
  return { autorun_enabled: true, autorun_program: form.autorun_command }
}

export const parseAdvancedForm = (form: AdvancedForm): AdvancedValues | null => {
  const values = { ...ADVANCED_DEFAULTS }

  for (const key of NUMERIC_FIELDS) {
    const value = form[key]
    if (!isNumericValueValid(key, value)) return null
    values[key] = value
  }

  const autorun = parseAutorun(form)
  if (!autorun) return null

  values.queueing_enabled = form.queueing_enabled
  values.autorun_enabled = autorun.autorun_enabled
  values.autorun_program = autorun.autorun_program

  return values
}

const PATCH_KEYS = [
  ...NUMERIC_FIELDS,
  'queueing_enabled',
  'autorun_enabled',
  'autorun_program',
] as const satisfies readonly (keyof AdvancedValues)[]

export const buildPreferencesPatch = (values: AdvancedValues, original: AdvancedValues): Partial<Preferences> => {
  const patch: Partial<Preferences> = {}

  for (const key of PATCH_KEYS) {
    if (values[key] !== original[key]) {
      Object.assign(patch, { [key]: values[key] })
    }
  }

  return patch
}
