import { beforeEach, describe, expect, it } from 'vitest'
import { preferences } from '@/entities/preferences'
import { maindata } from '@/entities/stats'
import type { Preferences } from '@/shared/api/app'
import { mockMainData } from '@/shared/test'
import {
  completedCategories,
  completedFiltered,
  completedTorrents,
  cycleRatioFilter,
  downloadingTorrents,
  filters,
  otherTorrents,
  query,
  queuedTorrents,
  ratioFilterLabel,
  toggleCategoryFilter,
  toggleUploadingFilter,
  torrents,
} from './torrents'

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
    preferences.value = null
    filters.value = { ratio: 'off', uploading: false, category: '', query: '' }
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

  it('filters completed torrents by ratio >= 1 in the first ratio state', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedCompletedTorrent('a', { ratio: 1 }),
        b: seedCompletedTorrent('b', { ratio: 0.5 }),
      },
    })

    // act
    cycleRatioFilter()

    // assert
    expect(completedFiltered.value.map((t) => t.id)).toEqual(['a'])
  })

  it('filters completed torrents at or above the configured ratio limit', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedCompletedTorrent('a', { ratio: 3 }),
        b: seedCompletedTorrent('b', { ratio: 2.9 }),
      },
    })

    // act
    cycleRatioFilter()
    cycleRatioFilter()

    // assert
    expect(ratioFilterLabel.value).toBe('Ratio 3+')
    expect(completedFiltered.value.map((t) => t.id)).toEqual(['a'])
  })

  it('takes the ratio limit from preferences', () => {
    // arrange
    preferences.value = { max_ratio: 5 } as Preferences
    mockMainData({
      torrents: {
        a: seedCompletedTorrent('a', { ratio: 4 }),
        b: seedCompletedTorrent('b', { ratio: 5 }),
      },
    })

    // act
    cycleRatioFilter()
    cycleRatioFilter()

    // assert
    expect(ratioFilterLabel.value).toBe('Ratio 5+')
    expect(completedFiltered.value.map((t) => t.id)).toEqual(['b'])
  })

  it('filters completed torrents below the configured ratio limit', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedCompletedTorrent('a', { ratio: 2.9 }),
        b: seedCompletedTorrent('b', { ratio: 3 }),
      },
    })

    // act
    cycleRatioFilter()
    cycleRatioFilter()
    cycleRatioFilter()

    // assert
    expect(ratioFilterLabel.value).toBe('Ratio < 3')
    expect(completedFiltered.value.map((t) => t.id)).toEqual(['a'])
  })

  it('cycles the ratio filter off and applies no ratio filter', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedCompletedTorrent('a', { ratio: 0.5 }),
        b: seedCompletedTorrent('b', { ratio: 4 }),
      },
    })

    // act
    cycleRatioFilter()
    cycleRatioFilter()
    cycleRatioFilter()
    cycleRatioFilter()

    // assert
    expect(filters.value.ratio).toBe('off')
    expect(ratioFilterLabel.value).toBe('Ratio > 1')
    expect(completedFiltered.value.map((t) => t.id)).toEqual(['a', 'b'])
  })

  it('filters uploading torrents by state and speed', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedCompletedTorrent('a', { state: 'uploading', upspeed: 100_000 }),
        b: seedCompletedTorrent('b', { state: 'uploading', upspeed: 100 }),
        c: seedCompletedTorrent('c', { state: 'stalledUP', upspeed: 100_000 }),
      },
    })

    // act
    toggleUploadingFilter()

    // assert
    expect(completedFiltered.value.map((t) => t.id)).toEqual(['a'])
  })

  it('filters completed torrents by category', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedCompletedTorrent('a', { category: 'anime' }),
        b: seedCompletedTorrent('b', { category: 'series' }),
      },
    })

    // act
    toggleCategoryFilter('anime')

    // assert
    expect(completedFiltered.value.map((t) => t.id)).toEqual(['a'])
  })

  it('filters completed torrents by name, case-insensitively', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedCompletedTorrent('a', { name: 'Ubuntu 24.04 ISO' }),
        b: seedCompletedTorrent('b', { name: 'Debian 12 ISO' }),
      },
    })

    // act
    query.value = '  ubuntu '

    // assert
    expect(completedFiltered.value.map((t) => t.id)).toEqual(['a'])

    // act
    query.value = ''

    // assert
    expect(completedFiltered.value.map((t) => t.id)).toEqual(['a', 'b'])
  })

  it('toggles category filter off when selecting the same category', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedCompletedTorrent('a', { category: 'anime' }),
        b: seedCompletedTorrent('b', { category: 'series' }),
      },
    })

    // act
    toggleCategoryFilter('anime')
    toggleCategoryFilter('anime')

    // assert
    expect(completedFiltered.value).toHaveLength(2)
  })

  it('computes unique completed categories', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedCompletedTorrent('a', { category: 'anime' }),
        b: seedCompletedTorrent('b', { category: 'anime' }),
        c: seedCompletedTorrent('c', { category: 'series' }),
        d: seedCompletedTorrent('d', { category: '' }),
      },
    })

    // assert
    expect(completedCategories.value).toEqual(['anime', 'series'])
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
