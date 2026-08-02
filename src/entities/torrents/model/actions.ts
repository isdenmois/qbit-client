import { maindata } from '@/entities/stats'
import { api } from '@/shared/api'
import { omit } from '@/shared/lib/utils'
import { maxPriority, type Torrent } from './torrents'

const setTorrentState = (id: string, state: Torrent['state']) => {
  if (maindata.value?.torrents[id]) {
    maindata.value.torrents[id].state = state
  }
}

const swapPriority = (from: number, to: number) => {
  for (const torrent of Object.values(maindata.value?.torrents ?? {})) {
    if (torrent.priority === from) {
      torrent.priority = to
    } else if (torrent.priority === to) {
      torrent.priority = from
    }
  }
}

export const increasePriority = async (id: string) => {
  const current = maindata.value?.torrents[id]?.priority ?? 1
  const target = Math.max(1, current - 1)

  if (current !== target) {
    swapPriority(current, target)

    await api.torrent.increasePrio(id)
  }
}

export const decreasePriority = async (id: string) => {
  const current = maindata.value?.torrents[id]?.priority ?? 1
  const target = Math.min(current + 1, maxPriority.value)

  if (current !== target) {
    swapPriority(current, target)

    await api.torrent.decreasePrio(id)
  }
}

export const resumeTorrent = async (id: string) => {
  await api.torrent.resume(id)

  setTorrentState(id, 'stalledDL')
}

export const pauseTorrent = async (id: string) => {
  await api.torrent.pause(id)

  setTorrentState(id, 'stoppedDL')
}

export const deleteTorrent = async (id: string, deleteFiles: boolean) => {
  await api.torrent.delete(id, deleteFiles)

  setTorrentState(id, 'deleted')

  if (maindata.value) {
    maindata.value = { ...maindata.value, torrents: omit(id, maindata.value.torrents) }
  }
}
