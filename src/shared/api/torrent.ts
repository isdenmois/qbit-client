import { http } from './client'

interface TorrentProperties {
  comment: string
}

export interface Category {
  id: string
  name: string
  savePath: string
}

export const torrent = {
  properties: (hash: string) => http.query({ hash }).get('/torrents/properties').json() as Promise<TorrentProperties>,
  /**
   * Get all categories
   */
  categories: () =>
    http
      .get('/torrents/categories')
      .json()
      .then((data) => data as Record<string, Category>)
      .then((data) => Object.entries(data).map(([id, category]) => ({ ...category, id }) as Category)),
  /**
   * Add new torrent
   */
  add: (file: File, category: string, sequentialDownload: boolean) => {
    return http
      .url('/torrents/add')
      .formData({
        'fileselect[]': [file],
        category,
        autoTMM: true,
        sequentialDownload,
        firstLastPiecePrio: sequentialDownload,
        paused: false,
        stopCondition: 'None',
        contentLayout: 'Original',
      })
      .post()
      .text()
      .then((response) => response === 'Ok.')
  },
}
