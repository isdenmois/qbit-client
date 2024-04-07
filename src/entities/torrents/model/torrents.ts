import { computed } from 'nanostores'
import type { TorrentInfo } from 'shared/api/sync'
import { compare } from 'shared/lib/utils'
import { maindata } from 'entities/stats'

export type Torrent = TorrentInfo & { id: string }

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

export const activeTorrentsCount = computed(activeTorrents, (activeTorrents) => activeTorrents.length)
export const completedTorrentsCount = computed(completedTorrents, (completedTorrents) => completedTorrents.length)
export const pausedTorrentsCount = computed(pausedTorrents, (pausedTorrents) => pausedTorrents.length)
