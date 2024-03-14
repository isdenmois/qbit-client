import { http } from './client'

interface TorrentProperties {
  comment: string
}

export const torrent = {
  properties: (hash: string) => http.query({ hash }).get('/torrents/properties').json() as Promise<TorrentProperties>,
}
