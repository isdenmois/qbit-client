import { atom, onMount } from 'nanostores'
import { api } from 'shared/api'
import type { Category } from 'shared/api/torrent'

export const categories = atom<Category[]>([])

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
