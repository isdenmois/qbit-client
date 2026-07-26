import { computed, ref } from 'vue'
import { maindata } from '@/entities/stats'
import type { TorrentInfo } from '@/shared/api/sync'
import { compare } from '@/shared/lib/utils'

export type Torrent = TorrentInfo & { id: string }

export const filters = ref({ uploaded: false, uploading: false, category: '' })

export const torrents = computed(() => {
  if (!maindata.value) {
    return []
  }

  return Object.entries(maindata.value.torrents).map(([id, value]) => ({ ...value, id }) as Torrent)
})

const DOWNLOADING_STATES = new Set<Torrent['state']>(['downloading', 'stalledDL', 'pausedDL'])
const byDownload = compare((torrent: Torrent) => -torrent.dlspeed)

const isDownloading = (torrent: Torrent) => DOWNLOADING_STATES.has(torrent.state)

export const downloadingTorrents = computed(() => torrents.value.filter(isDownloading).sort(byDownload))

const byUpload = compare((torrent: Torrent) => -torrent.upspeed)

const isUploading = (torrent: Torrent) => torrent.state === 'uploading' && torrent.upspeed > 10_240

export const completedTorrents = computed(() =>
  torrents.value.filter((torrent) => torrent.progress >= 1).sort(compare((torrent) => -torrent.completion_on)),
)

export const completedFiltered = computed(() => {
  let result = completedTorrents.value

  if (filters.value.uploaded) {
    result = result.filter((torrent) => torrent.ratio > 1)
  }

  if (filters.value.uploading) {
    result = result.filter(isUploading).sort(byUpload)
  }

  if (filters.value.category) {
    result = result.filter((torrent) => torrent.category === filters.value.category)
  }

  return result
})

export const completedCategories = computed(() => {
  const categories = new Set(completedTorrents.value.map((torrent) => torrent.category))

  return Array.from(categories).filter(Boolean).sort()
})

export function toggleUploadedFilter() {
  filters.value = { ...filters.value, uploaded: !filters.value.uploaded }
}

export function toggleUploadingFilter() {
  filters.value = { ...filters.value, uploading: !filters.value.uploading }
}

export function toggleCategoryFilter(category: string) {
  if (filters.value.category === category) {
    filters.value = { ...filters.value, category: '' }
  } else {
    filters.value = { ...filters.value, category }
  }
}
