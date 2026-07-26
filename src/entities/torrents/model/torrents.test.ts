import { beforeEach, describe, expect, it } from 'vitest'
import { maindata } from '@/entities/stats'
import { mockMainData } from '@/shared/test'
import {
  completedCategories,
  completedFiltered,
  completedTorrents,
  downloadingTorrents,
  filters,
  toggleCategoryFilter,
  toggleUploadedFilter,
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
    ...overrides,
  }) as const

describe('torrents', () => {
  beforeEach(() => {
    maindata.value = null
    filters.value = { uploaded: false, uploading: false, category: '' }
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

  it('lists downloading torrents sorted by download speed', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedDownloadingTorrent('a', { dlspeed: 100 }),
        b: seedDownloadingTorrent('b', { dlspeed: 500 }),
        c: seedCompletedTorrent('c'),
      },
    })

    // assert
    expect(downloadingTorrents.value.map((t) => t.id)).toEqual(['b', 'a'])
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

  it('filters uploaded torrents by ratio > 1', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedCompletedTorrent('a', { ratio: 2 }),
        b: seedCompletedTorrent('b', { ratio: 0.5 }),
      },
    })

    // act
    toggleUploadedFilter()

    // assert
    expect(completedFiltered.value.map((t) => t.id)).toEqual(['a'])
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
})
