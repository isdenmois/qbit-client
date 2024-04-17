import { http } from './client'

interface TorrentProperties {
  comment: string
}

export interface Category {
  id: string
  name: string
  savePath: string
}

enum Priority {
  None = 0,
  Normal = 1,
  High = 6,
  Maximum = 7,
}

export interface TorrentFile {
  name: string
  priority: Priority
  progress: number
  size: number
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
  pause: (...ids: string[]) =>
    http
      .url('/torrents/pause')
      .formData({ hashes: ids.join('|') })
      .post()
      .text(),
  resume: (...ids: string[]) =>
    http
      .url('/torrents/resume')
      .formData({ hashes: ids.join('|') })
      .post()
      .text(),
  delete: (id: string, deleteFiles: boolean) =>
    http.url('/torrents/delete').formData({ hashes: id, deleteFiles }).post().text(),
  files: (id: string) => http.url('/torrents/files').query({ hash: id }).get().json() as Promise<TorrentFile[]>,
}
