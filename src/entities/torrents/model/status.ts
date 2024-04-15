import type { TorrentInfo } from 'shared/api/sync'

const PAUSED_STATES = ['pausedDL', 'pausedUP']

export const isPaused = (torrent: TorrentInfo) => PAUSED_STATES.includes(torrent.state)
