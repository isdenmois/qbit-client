import { api } from 'shared/api'
import { maindata, updateMainData } from 'entities/stats'
import type { Torrent } from './torrents'
import omit from 'omit'

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
  const data = maindata.get()

  if (data) {
    maindata.set({ ...data, torrents: omit(id, data.torrents) })
  }
}
