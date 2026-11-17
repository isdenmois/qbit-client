import { beforeEach, describe, expect, it } from 'vitest'
import { categories, removeCategoryLocally } from './categories'
import { maindata, updateMainData } from './maindata'

describe('categories', () => {
  beforeEach(() => {
    maindata.value = null
  })

  it('derives categories from maindata', () => {
    // arrange
    updateMainData({
      full_update: true,
      rid: 1,
      server_state: {},
      torrents: {},
      categories: {
        Anime: { name: 'Anime', savePath: '/downloads/anime' },
        Series: { name: 'Series', savePath: '/downloads/series' },
      },
    })

    // act
    const result = categories.value

    // assert
    expect(result).toEqual([
      { name: 'Anime', savePath: '/downloads/anime' },
      { name: 'Series', savePath: '/downloads/series' },
    ])
  })

  it('is empty when maindata is not loaded yet', () => {
    // act
    const result = categories.value

    // assert
    expect(result).toEqual([])
  })
})

describe('removeCategoryLocally', () => {
  beforeEach(() => {
    maindata.value = null
  })

  it('removes the category from maindata', () => {
    // arrange
    updateMainData({
      full_update: true,
      rid: 1,
      server_state: {},
      torrents: {},
      categories: {
        Anime: { name: 'Anime', savePath: '/downloads/anime' },
        Games: { name: 'Games', savePath: '/downloads/games' },
      },
    })

    // act
    removeCategoryLocally('Games')

    // assert
    expect(categories.value).toEqual([{ name: 'Anime', savePath: '/downloads/anime' }])
  })

  it('does nothing when maindata has no categories', () => {
    // arrange
    updateMainData({ full_update: true, rid: 1, server_state: {}, torrents: {} })

    // act
    removeCategoryLocally('Games')

    // assert
    expect(categories.value).toEqual([])
  })
})
