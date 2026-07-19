import { api } from 'shared/api'
import type { Category } from 'shared/api/torrent'
import { ref } from 'vue'

export const categories = ref<Category[]>([])

const CATEGORIES = {
  anime: 'Anime',
  series: 'Series',
  games: 'Games',
}

const KEYWORDS: Record<string, string[]> = {
  [CATEGORIES.anime]: ['rus(ext)', 'rus(int)'],
  [CATEGORIES.series]: ['сезон', 'сери'],
  [CATEGORIES.games]: ['dlc', 'portable'],
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

export const loadCategories = async () => {
  try {
    categories.value = await api.torrent.categories()
  } catch (error) {
    console.log('Error loading', error)
  }
}
