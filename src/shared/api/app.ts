import { http } from './client'

export interface Preferences {
  max_active_downloads: number
  max_ratio: number
  max_uploads_per_torrent: number
  max_connec?: number
  max_connec_per_torrent?: number
  max_uploads?: number
  max_active_uploads?: number
  max_active_torrents?: number
  async_io_threads?: number
  queueing_enabled?: boolean
  autorun_enabled?: boolean
  autorun_program?: string
}

export const app = {
  version: () => http.get('/app/version').text(),
  preferences: () => http.get('/app/preferences').json() as Promise<Preferences>,
  setPreferences: (prefs: Partial<Preferences>) =>
    http
      .url('/app/setPreferences')
      .formData({ json: JSON.stringify(prefs) })
      .post()
      .text(),
}
