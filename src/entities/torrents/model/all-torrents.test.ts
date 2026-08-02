import { beforeEach, describe, expect, it } from 'vitest'
import { mockMainData } from '@/shared/test'
import { category, order, selectCategory, torrentsFiltered } from './all-torrents'

const seedTorrent = (id: string, overrides: Record<string, unknown> = {}) =>
  ({
    id,
    name: `Torrent ${id}`,
    state: 'downloading',
    progress: 0.5,
    dlspeed: 1_000_000,
    upspeed: 0,
    completion_on: 0,
    added_on: 0,
    category: 'anime',
    ratio: 0.5,
    priority: 1,
    ...overrides,
  }) as const

describe('all-torrents', () => {
  beforeEach(() => {
    category.value = ''
    order.value = 'added_on'
    mockMainData({ torrents: {} })
  })

  it('starts with an empty category filter and added_on order', () => {
    // assert
    expect(category.value).toBe('')
    expect(order.value).toBe('added_on')
    expect(torrentsFiltered.value).toHaveLength(0)
  })

  it('lists all torrents when no category is selected', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedTorrent('a', { category: 'anime' }),
        b: seedTorrent('b', { category: 'series' }),
      },
    })

    // assert
    expect(torrentsFiltered.value.map((t) => t.id)).toEqual(['a', 'b'])
  })

  it('selects a category to filter torrents', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedTorrent('a', { category: 'anime' }),
        b: seedTorrent('b', { category: 'series' }),
      },
    })

    // act
    selectCategory('anime')

    // assert
    expect(category.value).toBe('anime')
    expect(torrentsFiltered.value.map((t) => t.id)).toEqual(['a'])
  })

  it('clears the category filter when selecting the same category again', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedTorrent('a', { category: 'anime' }),
        b: seedTorrent('b', { category: 'series' }),
      },
    })

    // act
    selectCategory('anime')
    selectCategory('anime')

    // assert
    expect(category.value).toBe('')
    expect(torrentsFiltered.value).toHaveLength(2)
  })

  it('switches to a different category when selecting another one', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedTorrent('a', { category: 'anime' }),
        b: seedTorrent('b', { category: 'series' }),
      },
    })

    // act
    selectCategory('anime')
    selectCategory('series')

    // assert
    expect(category.value).toBe('series')
    expect(torrentsFiltered.value.map((t) => t.id)).toEqual(['b'])
  })

  it('sorts torrents by added_on descending by default', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedTorrent('a', { added_on: 100 }),
        b: seedTorrent('b', { added_on: 300 }),
        c: seedTorrent('c', { added_on: 200 }),
      },
    })

    // assert
    expect(torrentsFiltered.value.map((t) => t.id)).toEqual(['b', 'c', 'a'])
  })

  it('re-sorts torrents when the order changes', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedTorrent('a', { added_on: 100, progress: 0.2 }),
        b: seedTorrent('b', { added_on: 200, progress: 0.9 }),
        c: seedTorrent('c', { added_on: 300, progress: 0.5 }),
      },
    })

    // act
    order.value = 'progress'

    // assert
    expect(torrentsFiltered.value.map((t) => t.id)).toEqual(['b', 'c', 'a'])
  })

  it('applies both category filter and order', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedTorrent('a', { category: 'anime', added_on: 100 }),
        b: seedTorrent('b', { category: 'series', added_on: 200 }),
        c: seedTorrent('c', { category: 'anime', added_on: 300 }),
      },
    })

    // act
    selectCategory('anime')
    order.value = 'added_on'

    // assert
    expect(torrentsFiltered.value.map((t) => t.id)).toEqual(['c', 'a'])
  })

  it('does not mutate the source torrents when sorting', () => {
    // arrange
    mockMainData({
      torrents: {
        a: seedTorrent('a', { added_on: 100 }),
        b: seedTorrent('b', { added_on: 300 }),
      },
    })
    const before = torrentsFiltered.value.map((t) => t.id)

    // act
    torrentsFiltered.value

    // assert
    expect(torrentsFiltered.value.map((t) => t.id)).toEqual(before)
  })
})
