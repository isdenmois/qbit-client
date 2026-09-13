import { computed, ref } from 'vue'
import { maindata } from '@/entities/stats'
import type { TorrentInfo } from '@/shared/api/sync'
import { compare } from '@/shared/lib/utils'

export type Torrent = TorrentInfo & { id: string }

export const filters = ref({ uploaded: false, uploading: false, category: '' })

export const category = ref('')

export const torrents = computed(() => {
  if (!maindata.value) {
    return []
  }

  return Object.entries(maindata.value.torrents).map(([id, value]) => ({ ...value, id }) as Torrent)
})

const DOWNLOADING_STATES = new Set<Torrent['state']>(['downloading', 'stalledDL', 'pausedDL'])
const byPriority = compare((torrent: Torrent) => torrent.priority)

const isDownloading = (torrent: Torrent) => DOWNLOADING_STATES.has(torrent.state)

export const downloadingTorrents = computed(() => torrents.value.filter(isDownloading).sort(byPriority))

export const queuedTorrents = computed(() =>
  torrents.value.filter((torrent) => torrent.state === 'queuedDL').sort(byPriority),
)

export const pausedTorrents = computed(() =>
  torrents.value.filter((torrent) => torrent.state === 'stoppedDL').sort(byPriority),
)

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

export const maxPriority = computed(() => {
  if (!maindata.value) return 1

  return Math.max(1, ...Object.values(maindata.value.torrents).map((t) => t.priority))
})

// torrents that match none of the home page sections
export const otherTorrents = computed(() =>
  torrents.value
    .filter(
      (torrent) =>
        !isDownloading(torrent) &&
        torrent.state !== 'queuedDL' &&
        torrent.state !== 'stoppedDL' &&
        torrent.progress < 1,
    )
    .sort(compare((torrent) => -torrent.added_on)),
)
