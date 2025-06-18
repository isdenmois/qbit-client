import { atom, computed } from 'nanostores'
import type { TorrentInfo } from 'shared/api/sync'
import { compare } from 'shared/lib/utils'
import { maindata } from 'entities/stats'

export type Torrent = TorrentInfo & { id: string }

export const filters = atom({ uploaded: false, uploading: false, category: '' })

export const torrents = computed(maindata, (data) => {
  if (!data) {
    return []
  }

  return Object.entries(data.torrents).map(([id, value]) => ({ ...value, id }))
})

const DOWNLOADING_STATES = new Set<Torrent['state']>(['downloading', 'stalledDL', 'pausedDL'])
const byDownload = compare((torrent: Torrent) => -torrent.dlspeed)

const isDownloading = (torrent: Torrent) => DOWNLOADING_STATES.has(torrent.state)

export const downloadingTorrents = computed(torrents, (torrents) => torrents.filter(isDownloading).sort(byDownload))

const byUpload = compare((torrent: Torrent) => -torrent.upspeed)

const isUploading = (torrent: Torrent) => torrent.state === 'uploading' && torrent.upspeed > 10_240

export const completedTorrents = computed(torrents, (torrents) =>
  torrents.filter((torrent) => torrent.progress >= 1).sort(compare((torrent) => -torrent.completion_on)),
)

export const completedFiltered = computed([completedTorrents, filters], (completedTorrents, filters) => {
  let result = completedTorrents

  if (filters.uploaded) {
    result = result.filter((torrent) => torrent.ratio > 1)
  }

  if (filters.uploading) {
    result = result.filter(isUploading).sort(byUpload)
  }

  if (filters.category) {
    result = result.filter((torrent) => torrent.category === filters.category)
  }

  return result
})

export const completedCategories = computed(completedTorrents, (torrents) => {
  const categories = new Set(torrents.map((torrent) => torrent.category))

  return Array.from(categories).filter(Boolean).sort()
})

export function toggleUploadedFilter() {
  filters.set({ ...filters.get(), uploaded: !filters.get().uploaded })
}

export function toggleUploadingFilter() {
  filters.set({ ...filters.get(), uploading: !filters.get().uploading })
}

export function toggleCategoryFilter(category: string) {
  const currentFilter = filters.get()

  if (currentFilter.category === category) {
    filters.set({ ...filters.get(), category: '' })
  } else {
    filters.set({ ...filters.get(), category })
  }
}
