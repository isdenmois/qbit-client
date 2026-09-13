import type { Page } from '@playwright/test'
import type { MainData, ServerState, TorrentInfo } from '@/shared/api/sync'

let rid = 0

export const mockMaindata = async (page: Page, initialData: MainData) => {
  rid = initialData.rid
  await page.route('/api/v2/sync/maindata*', (route) => {
    return route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ ...initialData, full_update: true, rid: ++rid }),
    })
  })
}

export const seedServerState = (): ServerState => ({
  alltime_dl: 10_000_000_000,
  alltime_ul: 2_000_000_000,
  dl_info_data: 500_000_000,
  dl_info_speed: 12_500_000,
  dl_info_limit: 0,
  dl_rate_limit: 0,
  free_space_on_disk: 100_000_000_000,
  global_ratio: '0.20',
  up_info_data: 150_000_000,
  up_info_speed: 800_000,
  up_info_limit: 0,
  up_rate_limit: 0,
})

export const seedDownloadingTorrent = (_id: string): TorrentInfo => ({
  added_on: 1_700_000_000,
  completion_on: 0,
  name: 'Downloading Torrent',
  category: 'series',
  downloaded: 500_000_000,
  uploaded: 50_000_000,
  dlspeed: 12_500_000,
  upspeed: 800_000,
  num_complete: 42,
  num_seeds: 12,
  num_leechs: 5,
  priority: 1,
  size: 1_500_000_000,
  state: 'downloading',
  popularity: 7.5,
  progress: 0.35,
  ratio: 0.1,
  eta: 3600,
  save_path: '/downloads/series',
  comment: 'https://example.com/download',
})

export const seedCompletedTorrent = (_id: string): TorrentInfo => ({
  added_on: 1_690_000_000,
  completion_on: 1_695_000_000,
  name: 'Completed Torrent',
  category: 'anime',
  downloaded: 2_000_000_000,
  uploaded: 3_500_000_000,
  dlspeed: 0,
  upspeed: 1_200_000,
  num_complete: 120,
  num_seeds: 0,
  num_leechs: 3,
  priority: 0,
  size: 2_000_000_000,
  state: 'uploading',
  popularity: 15.0,
  progress: 1,
  ratio: 1.75,
  eta: 8640000,
  save_path: '/downloads/anime',
  comment: '',
})

export const seedQueuedTorrent = (_id: string): TorrentInfo => ({
  added_on: 1_705_000_000,
  completion_on: 0,
  name: 'Queued Torrent',
  category: 'series',
  downloaded: 0,
  uploaded: 0,
  dlspeed: 0,
  upspeed: 0,
  num_complete: 0,
  num_seeds: 0,
  num_leechs: 0,
  priority: 2,
  size: 800_000_000,
  state: 'queuedDL',
  popularity: 3.0,
  progress: 0,
  ratio: 0,
  eta: 8640000,
  save_path: '/downloads/series',
  comment: '',
})

export const seedErrorTorrent = (_id: string): TorrentInfo => ({
  added_on: 1_701_000_000,
  completion_on: 0,
  name: 'Error Torrent',
  category: 'series',
  downloaded: 300_000_000,
  uploaded: 0,
  dlspeed: 0,
  upspeed: 0,
  num_complete: 1,
  num_seeds: 0,
  num_leechs: 0,
  priority: 0,
  size: 900_000_000,
  state: 'error',
  popularity: 0,
  progress: 0.4,
  ratio: 0,
  eta: 0,
  save_path: '/downloads/series',
  comment: '',
})

export const maindataSeed = (): MainData => ({
  full_update: true,
  rid: 1,
  server_state: seedServerState(),
  torrents: {
    '1111111111111111111111111111111111111111': seedDownloadingTorrent('1111111111111111111111111111111111111111'),
    '2222222222222222222222222222222222222222': seedCompletedTorrent('2222222222222222222222222222222222222222'),
    '3333333333333333333333333333333333333333': seedQueuedTorrent('3333333333333333333333333333333333333333'),
  },
  categories: {
    Anime: { name: 'Anime', savePath: '/downloads/anime' },
    Series: { name: 'Series', savePath: '/downloads/series' },
    Games: { name: 'Games', savePath: '/downloads/games' },
  },
})

export const maindataEmpty = (): MainData => ({
  full_update: true,
  rid: 1,
  server_state: {
    ...seedServerState(),
    dl_info_speed: 0,
    up_info_speed: 0,
    free_space_on_disk: 100_000_000_000,
  },
  torrents: {},
  categories: {},
})
