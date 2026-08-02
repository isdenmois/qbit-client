import { describe, expect, it } from 'vitest'
import type { TorrentInfo } from '@/shared/api/sync'
import { isPaused } from './status'

const pausedStates: TorrentInfo['state'][] = ['pausedDL', 'pausedUP', 'stoppedDL', 'stoppedUP']
const activeStates: TorrentInfo['state'][] = [
  'stalledDL',
  'stalledUP',
  'downloading',
  'uploading',
  'queuedDL',
  'moving',
  'missingFiles',
  'deleted',
  'error',
]

const torrentWith = (state: TorrentInfo['state']): TorrentInfo =>
  ({
    state,
    hash: 'hash',
    name: 'name',
    size: 0,
    progress: 0,
    dlspeed: 0,
    upspeed: 0,
    priority: 0,
    num_seeds: 0,
    num_complete: 0,
    num_leechs: 0,
    num_incomplete: 0,
    ratio: 0,
    eta: 0,
    category: '',
    save_path: '',
    added_on: 0,
    completion_on: 0,
    downloaded: 0,
    uploaded: 0,
  }) as unknown as TorrentInfo

describe('isPaused', () => {
  it('returns true for paused states', () => {
    for (const state of pausedStates) {
      // arrange
      const torrent = torrentWith(state)

      // act
      const result = isPaused(torrent)

      // assert
      expect(result).toBe(true)
    }
  })

  it('returns false for active states', () => {
    for (const state of activeStates) {
      // arrange
      const torrent = torrentWith(state)

      // act
      const result = isPaused(torrent)

      // assert
      expect(result).toBe(false)
    }
  })
})
