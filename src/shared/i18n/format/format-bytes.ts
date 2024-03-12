import { formatNumberUnit } from './format-number'

const localeSizes: Record<string, string[]> = {
  en: ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
  ru: ['Б', 'Кб', 'Мб', 'Гб', 'Тб', 'Пб'],
}

export function formatBytes(bytes: number, locale: string) {
  const sizes = localeSizes[locale] ?? localeSizes.en

  if (bytes < 1024) return `${bytes} ${sizes[0]}`

  const i = Math.floor(Math.log(bytes) / Math.log(1024))

  return formatNumberUnit(bytes / Math.pow(1024, i), sizes[i])
}
