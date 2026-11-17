import { mockMainData } from '@test'
import { beforeEach, describe, expect, it } from 'vitest'
import { preferences } from '@/entities/preferences'
import { maindata } from '@/entities/torrents'
import type { Preferences } from '@/shared/api'
import {
  completedCategories,
  completedFiltered,
  cycleRatioFilter,
  filters,
  query,
  ratioFilterLabel,
  toggleCategoryFilter,
  toggleUploadingFilter,
} from './torrent-filters'

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

describe('torrent filters', () => {
  beforeEach(() => {
    maindata.value = null
    preferences.value = null
    filters.value = { ratio: 'off', uploading: false, category: '', query: '' }
    mockMainData({ torrents: {} })
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

  it('ignores a category filter whose category no longer exists', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedCompletedTorrent('a', { category: 'anime' }),
        b: seedCompletedTorrent('b', { category: 'series' }),
      },
    })

    // act
    toggleCategoryFilter('anime')
    mockMainData({ torrents: { a: { category: 'series' } } })

    // assert
    expect(completedFiltered.value.map((t) => t.id)).toEqual(['a', 'b'])
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
})
