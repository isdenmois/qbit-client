import { atom, computed } from 'nanostores'
import { torrents, type Torrent } from './torrents'
import { compare } from 'shared/lib/utils'

export const category = atom('')
export const order = atom<keyof Torrent>('added_on')

export const selectCategory = (cat: string) => {
  if (category.get() === cat) {
    category.set('')
  } else {
    category.set(cat)
  }
}

export const torrentsFiltered = computed([torrents, category, order], (torrents, category, order) => {
  const byCategory = category ? torrents.filter((torrent) => torrent.category === category) : [...torrents]

  return byCategory.sort(compare((torrent) => -torrent[order]))
})
