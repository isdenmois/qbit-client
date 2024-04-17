import { formatNumberUnit } from './format-number'

const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} ${sizes[0]}`

  const i = Math.floor(Math.log(bytes) / Math.log(1024))

  return formatNumberUnit(bytes / Math.pow(1024, i), sizes[i])
}
