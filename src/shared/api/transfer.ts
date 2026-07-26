import { http } from './client'

export const transfer = {
  setDownloadLimit: (limit: number) => http.url('/transfer/setDownloadLimit').formData({ limit }).post().text(),
  setUploadLimit: (limit: number) => http.url('/transfer/setUploadLimit').formData({ limit }).post().text(),
}
