import { locale, register, init } from 'svelte-i18n'
import { formatBytes as formatBytesRaw, formatEta as formatEtaRaw } from './format'
import { derived } from 'svelte/store'

export { t, locale } from 'svelte-i18n'

register('en', () => import('./en.json'))
register('ru', () => import('./ru.json'))

const fallbackLocale = 'en'

init({
  fallbackLocale,
  initialLocale: 'ru', // getLocaleFromNavigator(),
})

export const formatBytes = derived(locale, (value) => (bytes: number) => formatBytesRaw(bytes, value ?? fallbackLocale))

export const formatEta = derived(locale, (value) => (seconds: number) => formatEtaRaw(seconds, value ?? fallbackLocale))
