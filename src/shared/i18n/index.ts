import { formatBytes as formatBytesRaw, formatEta as formatEtaRaw } from './format'
import { derived } from 'svelte/store'
import { atom, computed } from 'nanostores'

const locales = {
  en: () => import('./en.json'),
  ru: () => import('./ru.json'),
} as const

const locale$ = atom<'ru' | 'en'>('ru')

const hasKey = (object: unknown, key: string): object is { [key]: unknown } => {
  return !!object && typeof object === 'object' && key in object
}

type Concat<T, K> = T extends string ? (K extends string ? `${T}.${K}` : never) : never

type Paths<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends string ? K : Concat<K, Paths<T[K]>>
    }[keyof T]
  : never

type PromiseValue<T> = T extends Promise<infer U> ? U : T

type Locale = PromiseValue<ReturnType<(typeof locales)['ru']>>['default']
type LocalePaths = Paths<Locale>

const t$ = derived(
  locale$,
  (locale, set) => {
    const localePromise = locales[locale as keyof typeof locales]()
    const cache = new Map<string, string>()

    localePromise.then((data) => {
      const getTranslation = (key: string) => {
        if (cache.has(key)) {
          return cache.get(key) ?? ''
        }

        const value = key
          .split('.')
          .reduce(
            (acc: unknown, key: string) => (hasKey(acc, key) ? acc[key as keyof typeof acc] : ''),
            data as unknown,
          ) as string

        cache.set(key, value)

        return value ?? ''
      }

      set((key, params) => {
        const translation = getTranslation(key)

        if (params && translation.includes('{')) {
          return translation.replace(/{([^}]+)}/g, (_, key) => (key in params ? params[key] : key))
        }

        return translation
      })
    })
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (key: LocalePaths, params?: Record<string, string | number>): string => key,
)

export { t$ as t, locale$ as locale }

export const formatBytes = computed(locale$, (value) => (bytes: number) => formatBytesRaw(bytes, value))

export const formatEta = computed(locale$, (value) => (seconds: number) => formatEtaRaw(seconds, value))
