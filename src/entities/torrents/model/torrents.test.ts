import { mockMainData } from '@test'
import { beforeEach, describe, expect, it } from 'vitest'
import { maindata } from '@/entities/torrents'
import { completedTorrents, downloadingTorrents, otherTorrents, queuedTorrents, torrents } from './torrents'

const seedDownloadingTorrent = (id: string, overrides: Record<string, unknown> = {}) =>
  ({
    id,
    name: `Downloading ${id}`,
    state: 'downloading',
    progress: 0.5,
    dlspeed: 1_000_000,
    upspeed: 0,
    completion_on: 0,
    category: 'anime',
    ratio: 0.5,
    priority: 1,
    ...overrides,
  }) as const

const seedCompletedTorrent = (id: string, overrides: Record<string, unknown> = {}) =>
  ({
    id,
    name: `Completed ${id}`,
    state: 'uploading',
    progress: 1,
    dlspeed: 0,
    upspeed: 100_000,
    completion_on: 1_700_000_000,
    category: 'series',
    ratio: 1.5,
    priority: 0,
    ...overrides,
  }) as const

describe('torrents', () => {
  beforeEach(() => {
    maindata.value = null
    mockMainData({ torrents: {} })
  })

  it('derives an empty list when maindata is empty', () => {
    expect(torrents.value).toHaveLength(0)
  })

  it('derives torrents from maindata with ids', () => {
    // arrange
    mockMainData({
      torrents: {
        '1111111111111111111111111111111111111111': seedDownloadingTorrent('1111111111111111111111111111111111111111'),
      },
    })

    // assert
    expect(torrents.value).toHaveLength(1)
    expect(torrents.value[0].id).toBe('1111111111111111111111111111111111111111')
  })

  it('lists downloading torrents sorted by priority', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedDownloadingTorrent('a', { priority: 2 }),
        b: seedDownloadingTorrent('b', { priority: 1 }),
        c: seedCompletedTorrent('c'),
      },
    })

    // assert
    expect(downloadingTorrents.value.map((t) => t.id)).toEqual(['b', 'a'])
  })

  it('lists queued torrents sorted by priority', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedDownloadingTorrent('a', { state: 'queuedDL', priority: 2 }),
        b: seedDownloadingTorrent('b', { state: 'queuedDL', priority: 1 }),
        c: seedDownloadingTorrent('c', { state: 'downloading', priority: 3 }),
      },
    })

    // assert
    expect(queuedTorrents.value.map((t) => t.id)).toEqual(['b', 'a'])
  })

  it('lists completed torrents sorted by completion date', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedCompletedTorrent('a', { completion_on: 100 }),
        b: seedCompletedTorrent('b', { completion_on: 300 }),
        c: seedDownloadingTorrent('c'),
      },
    })

    // assert
    expect(completedTorrents.value.map((t) => t.id)).toEqual(['b', 'a'])
  })

  it('lists torrents matching no section, most recent first', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedDownloadingTorrent('a', { added_on: 100 }),
        b: seedDownloadingTorrent('b', { state: 'queuedDL', added_on: 200 }),
        c: seedDownloadingTorrent('c', { state: 'stoppedDL', added_on: 300 }),
        d: seedCompletedTorrent('d', { added_on: 400 }),
        e: seedDownloadingTorrent('e', { state: 'error', added_on: 500 }),
        f: seedDownloadingTorrent('f', { state: 'missingFiles', added_on: 600 }),
      },
    })

    // assert
    expect(otherTorrents.value.map((t) => t.id)).toEqual(['f', 'e'])
  })

  it('lists a seeding state with partial progress under other torrents', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedDownloadingTorrent('a', { state: 'pausedUP', progress: 0.5, added_on: 100 }),
      },
    })

    // assert
    expect(otherTorrents.value.map((t) => t.id)).toEqual(['a'])
  })
})
