import { http } from './client'

interface TorrentProperties {
  comment: string
}

export interface TorrentAddResponse {
  added_torrent_ids: string[]
  failure_count: number
  pending_count: number
  success_count: number
}

export interface Category {
  name: string
  savePath: string
}

export enum Priority {
  None = 0,
  Normal = 1,
  High = 6,
  Maximum = 7,
}

export interface TorrentFile {
  index: number
  name: string
  priority: Priority
  progress: number
  size: number
}

export const torrent = {
  properties: (hash: string) => http.query({ hash }).get('/torrents/properties').json() as Promise<TorrentProperties>,
  /**
   * Add new torrent
   */
  add: (files: File[], category: string, sequentialDownload: boolean) => {
    return http
      .url('/torrents/add')
      .formData({
        'fileselect[]': files,
        category,
        autoTMM: true,
        sequentialDownload,
        firstLastPiecePrio: sequentialDownload,
        paused: false,
        stopCondition: 'None',
        contentLayout: 'Original',
      })
      .post()
      .json() as Promise<TorrentAddResponse>
  },
  pause: (...ids: string[]) =>
    http
      .url('/torrents/stop')
      .formData({ hashes: ids.join('|') })
      .post()
      .text(),
  increasePrio: (...ids: string[]) =>
    http
      .url('/torrents/increasePrio')
      .formData({ hashes: ids.join('|') })
      .post()
      .text(),
  decreasePrio: (...ids: string[]) =>
    http
      .url('/torrents/decreasePrio')
      .formData({ hashes: ids.join('|') })
      .post()
      .text(),
  resume: (...ids: string[]) =>
    http
      .url('/torrents/start')
      .formData({ hashes: ids.join('|') })
      .post()
      .text(),
  delete: (id: string, deleteFiles: boolean) =>
    http.url('/torrents/delete').formData({ hashes: id, deleteFiles }).post().text(),
  files: (id: string) => http.url('/torrents/files').query({ hash: id }).get().json() as Promise<TorrentFile[]>,
  setPriority: (id: string, files: TorrentFile[], priority: number) =>
    http
      .url('/torrents/filePrio')
      .formData({ hash: id, id: files.map((file) => file.index).join('|'), priority })
      .post()
      .text(),
  setCategory: (id: string, category: string) =>
    http.url('/torrents/setCategory').formData({ hashes: id, category }).post().text(),
  createCategory: (name: string, savePath: string) =>
    http.url('/torrents/createCategory').formData({ category: name, savePath }).post().text(),
  editCategory: (name: string, savePath: string) =>
    http.url('/torrents/editCategory').formData({ category: name, savePath }).post().text(),
  removeCategories: (...names: string[]) =>
    http
      .url('/torrents/removeCategories')
      .formData({ categories: names.join('\n') })
      .post()
      .text(),
}
