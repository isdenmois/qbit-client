import omit from 'omit'
import { maindata, updateMainData } from '@/entities/stats'
import { api } from '@/shared/api'
import type { Torrent } from './torrents'

const setTorrentState = (id: string, state: Torrent['state']) => {
  updateMainData({
    torrents: {
      [id]: { state },
    },
  })
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
