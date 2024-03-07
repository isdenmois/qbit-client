import { http } from './client'

export interface ServerState {
  alltime_dl: number
  alltime_ul: number
  dl_info_data: number
  dl_info_speed: number
  dl_info_limit: number
  dl_rate_limit: number
  free_space_on_disk: number
  global_ratio: string
  up_info_data: number
  up_info_speed: number
  up_info_limit: number
  up_rate_limit: number
}

export interface TorrentInfo {
  added_on: number
}

export interface MainData {
  full_update: boolean
  rid: number
  server_state: ServerState
  torrents: Record<string, TorrentInfo>
}

export const sync = {
  maindata: (rid?: number) => http.query({ rid }).get('/sync/maindata').json() as Promise<MainData>,
}
