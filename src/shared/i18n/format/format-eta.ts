const formatters: Record<string, string[]> = {
  en: ['s', 'm', 'h', 'd'],
  ru: ['с', 'м', 'ч', 'д'],
}

const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export function formatEta(seconds: number, locale: string) {
  const [sec, min, hour, day] = formatters[locale] ?? formatters.ru

  if (seconds < 1) {
    return `0${sec}`
  }

  seconds = Math.floor(seconds)

  if (seconds < MINUTE) {
    return `${seconds}${sec}`
  }

  let minutes = Math.floor(seconds / MINUTE)

  if (seconds < HOUR) {
    seconds -= minutes * MINUTE

    if (seconds > 0) {
      return `${minutes}${min} ${seconds}${sec}`
    }

    return `${minutes}${min}`
  }

  let hours = Math.floor(seconds / HOUR)

  if (seconds < DAY) {
    minutes -= hours * 60

    if (minutes > 0) {
      return `${hours}${hour} ${minutes}${min}`
    }

    return `${hours}${hour}`
  }

  const days = Math.floor(seconds / DAY)
  hours -= days * 24

  if (hours > 0) {
    return `${days}${day} ${hours}${hour}`
  }

  return `${days}${day}`
}
