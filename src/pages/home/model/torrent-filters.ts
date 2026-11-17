import { computed, ref } from 'vue'
import { preferences } from '@/entities/preferences'
import { completedTorrents, type Torrent } from '@/entities/torrents'
import { compare } from '@/shared/lib/utils'

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

export const completedCategories = computed(() => {
  const categories = new Set(completedTorrents.value.map((torrent) => torrent.category))

  return Array.from(categories).filter(Boolean).sort()
})

// Ignore a category filter whose category has been deleted since it was selected.
const activeCategory = computed(() =>
  completedCategories.value.includes(filters.value.category) ? filters.value.category : '',
)

const byUpload = compare((torrent: Torrent) => -torrent.upspeed)

const isUploading = (torrent: Torrent) => torrent.state === 'uploading' && torrent.upspeed > 10_240

export const completedFiltered = computed(() => {
  let result = completedTorrents.value.filter(matchesRatio)

  if (filters.value.uploading) {
    result = result.filter(isUploading).sort(byUpload)
  }

  if (activeCategory.value) {
    result = result.filter((torrent) => torrent.category === activeCategory.value)
  }

  const needle = filters.value.query.trim().toLowerCase()

  if (needle) {
    result = result.filter((torrent) => torrent.name.toLowerCase().includes(needle))
  }

  return result
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
