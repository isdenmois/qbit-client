import { computed } from 'vue'
import type { TorrentInfo } from '@/shared/api'
import { compare } from '@/shared/lib/utils'
import { maindata } from './maindata'

export type Torrent = TorrentInfo & { id: string }

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

export const completedTorrents = computed(() =>
  torrents.value.filter((torrent) => torrent.progress >= 1).sort(compare((torrent) => -torrent.completion_on)),
)

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
