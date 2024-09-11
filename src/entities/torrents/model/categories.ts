import { atom, onMount } from 'nanostores'
import { api } from 'shared/api'
import type { Category } from 'shared/api/torrent'

export const categories = atom<Category[]>([])

const CATEGORIES = {
  anime: 'Anime',
  series: 'Series',
  games: 'Games',
}

const KEYWORDS = {
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

// TODO: async/poll store
onMount(categories, () => {
  const load = async () => {
    try {
      const data = await api.torrent.categories()

      categories.set(data)
    } catch (error) {
      console.log(`Error loading`, error)
    }
  }

  load()
})
