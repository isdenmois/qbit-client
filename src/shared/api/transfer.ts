import { http } from './client'

export const transfer = {
  setDownloadLimit: (limit: number) => http.url('/transfer/setDownloadLimit').formData({ limit }).post(),
  setUploadLimit: (limit: number) => http.url('/transfer/setUploadLimit').formData({ limit }).post(),
}
