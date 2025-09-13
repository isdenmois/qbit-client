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
  completion_on: number
  name: string
  category: string
  downloaded: number
  uploaded: number
  dlspeed: number
  upspeed: number
  num_complete: number
  num_seeds: number
  num_leechs: number
  size: number
  state:
    | 'pausedDL'
    | 'pausedUP'
    // Torrent is paused and has NOT finished downloading
    | 'stoppedDL'
    // Torrent is paused and has finished downloading
    | 'stoppedUP'
    // Torrent is being seeded, but no connection were made
    | 'stalledUP'
    // Torrent is being downloaded, but no connection were made
    | 'stalledDL'
    // Torrent is being seeded, but no connection were made
    | 'downloading'
    // Torrent is being seeded and data is being transferred
    | 'uploading'
    // Torrent is moving to another location
    | 'moving'
    // Torrent data files is missing
    | 'missingFiles'
    | 'deleted'
    // Some error occurred, applies to paused torrents
    | 'error'
  popularity: number
  progress: number
  ratio: number
  eta: number
  save_path: string
  comment: string
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
