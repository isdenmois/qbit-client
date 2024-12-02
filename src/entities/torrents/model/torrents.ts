import { atom, computed } from 'nanostores'
import type { TorrentInfo } from 'shared/api/sync'
import { compare } from 'shared/lib/utils'
import { maindata } from 'entities/stats'

export type Torrent = TorrentInfo & { id: string }

export const filters = atom({ uploaded: false, category: '' })

export const torrents = computed(maindata, (data) => {
  if (!data) {
    return []
  }

  return Object.entries(data.torrents).map(([id, value]) => ({ ...value, id }))
})

export const activeTorrents = computed(torrents, (torrents) =>
  torrents.filter((torrent) => torrent.state === 'downloading').sort(compare((torrent) => -torrent.dlspeed)),
)

export const completedTorrents = computed(torrents, (torrents) =>
  torrents.filter((torrent) => torrent.progress >= 1).sort(compare((torrent) => -torrent.completion_on)),
)

export const pausedTorrents = computed(torrents, (torrents) =>
  torrents.filter((torrent) => torrent.state === 'pausedDL').sort(compare((torrent) => -torrent.added_on)),
)

export const completedFiltered = computed([completedTorrents, filters], (completedTorrents, filters) => {
  let result = completedTorrents

  if (filters.uploaded) {
    result = result.filter((torrent) => torrent.ratio > 1)
  }

  if (filters.category) {
    result = result.filter((torrent) => torrent.category === filters.category)
  }

  return result
})

export const activeTorrentsCount = computed(activeTorrents, (activeTorrents) => activeTorrents.length)
export const completedTorrentsCount = computed(completedTorrents, (completedTorrents) => completedTorrents.length)
export const pausedTorrentsCount = computed(pausedTorrents, (pausedTorrents) => pausedTorrents.length)
export const completedFilteredCount = computed(
  [completedTorrentsCount, completedFiltered],
  (completedTorrentsCount, completedFiltered) => {
    const count = completedFiltered.length

    if (count != completedTorrentsCount) {
      return `${count} / ${completedTorrentsCount}`
    }

    return String(count)
  },
)

export const completedCategories = computed(completedTorrents, (torrents) => {
  const categories = new Set(torrents.map((torrent) => torrent.category))

  return Array.from(categories).filter(Boolean).sort()
})

export function toggleUploadedFilter() {
  filters.set({ ...filters.get(), uploaded: !filters.get().uploaded })
}

export function toggleCategoryFilter(category: string) {
  const currentFilter = filters.get()

  if (currentFilter.category === category) {
    filters.set({ ...filters.get(), category: '' })
  } else {
    filters.set({ ...filters.get(), category })
  }
}
