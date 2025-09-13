import type { TorrentInfo } from 'shared/api/sync'

const PAUSED_STATES: Set<TorrentInfo['state']> = new Set(['pausedDL', 'pausedUP', 'stoppedDL', 'stoppedUP'])

export const isPaused = (torrent: TorrentInfo) => PAUSED_STATES.has(torrent.state)
