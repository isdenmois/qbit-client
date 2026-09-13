import { computed } from 'vue'
import { maindata } from '@/entities/stats/model/maindata'
import type { Category } from '@/shared/api/torrent'

export const categories = computed<Category[]>(() => Object.values(maindata.value?.categories ?? {}))

export const removeCategoryLocally = (name: string) => {
  if (maindata.value?.categories) {
    delete maindata.value.categories[name]
  }
}

const CATEGORIES = {
  anime: 'Anime',
  series: 'Series',
  games: 'Games',
}

const KEYWORDS: Record<string, string[]> = {
  [CATEGORIES.anime]: ['rus(ext)', 'rus(int)'],
  [CATEGORIES.series]: ['сезон', 'сери', 'выпуск', 's0'],
  [CATEGORIES.games]: ['dlc', 'portable', 'gog', 'steam-rip'],
}

export const guessCategory = (filename: string) => {
  const name = filename.toLowerCase()

  for (const category in KEYWORDS) {
    for (const keyword of KEYWORDS[category]) {
      if (name.includes(keyword)) {
        return category
      }
    }
  }

  return CATEGORIES.anime
}
