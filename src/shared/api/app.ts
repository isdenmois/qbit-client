import { http } from './client'

export const app = {
  version: () => http.get('/app/version').text(),
}
