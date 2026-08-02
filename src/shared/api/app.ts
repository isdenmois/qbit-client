import { http } from './client'

export interface Preferences {
  max_active_downloads: number
  max_ratio: number
  max_uploads_per_torrent: number
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
