import { computed, ref } from 'vue'
import { preferences } from '@/entities/preferences'
import { maindata } from '@/entities/stats'
import type { TorrentInfo } from '@/shared/api/sync'
import { compare } from '@/shared/lib/utils'

export type Torrent = TorrentInfo & { id: string }

// Ratio filter states, cycled by the Completed toolbar button.
export type RatioFilter = 'off' | 'above-one' | 'above-limit' | 'below-limit'

const RATIO_FILTER_CYCLE: readonly RatioFilter[] = ['off', 'above-one', 'above-limit', 'below-limit']

const DEFAULT_RATIO_LIMIT = 3

export const filters = ref({ ratio: 'off' as RatioFilter, uploading: false, category: '', query: '' })

// qBittorrent stops a torrent once it reaches the configured max ratio, so that limit is the reference point.
export const ratioLimit = computed(() => {
  const limit = preferences.value?.max_ratio

  return limit && limit > 0 ? limit : DEFAULT_RATIO_LIMIT
})

export const ratioFilterActive = computed(() => filters.value.ratio !== 'off')

export const ratioFilterLabel = computed(() => {
  switch (filters.value.ratio) {
    case 'above-limit':
      return `Ratio ${ratioLimit.value}+`
    case 'below-limit':
      return `Ratio < ${ratioLimit.value}`
    default:
      return 'Ratio > 1'
  }
})

const matchesRatio = (torrent: Torrent) => {
  switch (filters.value.ratio) {
    case 'above-one':
      return torrent.ratio >= 1
    case 'above-limit':
      return torrent.ratio >= ratioLimit.value
    case 'below-limit':
      return torrent.ratio < ratioLimit.value
    default:
      return true
  }
}

export const query = computed({
  get: () => filters.value.query,
  set: (value: string) => {
    filters.value = { ...filters.value, query: value }
  },
})

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
  let result = completedTorrents.value.filter(matchesRatio)

  if (filters.value.uploading) {
    result = result.filter(isUploading).sort(byUpload)
  }

  if (filters.value.category) {
    result = result.filter((torrent) => torrent.category === filters.value.category)
  }

  const needle = filters.value.query.trim().toLowerCase()

  if (needle) {
    result = result.filter((torrent) => torrent.name.toLowerCase().includes(needle))
  }

  return result
})

export const completedCategories = computed(() => {
  const categories = new Set(completedTorrents.value.map((torrent) => torrent.category))

  return Array.from(categories).filter(Boolean).sort()
})

export function cycleRatioFilter() {
  const index = RATIO_FILTER_CYCLE.indexOf(filters.value.ratio)
  const ratio = RATIO_FILTER_CYCLE[(index + 1) % RATIO_FILTER_CYCLE.length]

  filters.value = { ...filters.value, ratio }
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
