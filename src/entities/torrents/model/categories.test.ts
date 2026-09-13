import { beforeEach, describe, expect, it } from 'vitest'
import { maindata, updateMainData } from '@/entities/stats/model/maindata'
import { categories, guessCategory, removeCategoryLocally } from './categories'

describe('guessCategory', () => {
  it('returns anime for russian anime release markers', () => {
    expect(guessCategory('[AniLibria] Title [RUS(ext)] [1080p].torrent')).toBe('Anime')
    expect(guessCategory('Title [RUS(int)] [2024].torrent')).toBe('Anime')
  })

  it('returns series for season markers', () => {
    expect(guessCategory('Title сезон 1.torrent')).toBe('Series')
    expect(guessCategory('Title сериал.torrent')).toBe('Series')
  })

  it('returns games for dlc or portable markers', () => {
    expect(guessCategory('Game.Title.DLC.torrent')).toBe('Games')
    expect(guessCategory('Game.Title.Portable.torrent')).toBe('Games')
  })

  it('defaults to anime when no keyword matches', () => {
    expect(guessCategory('Something.Else.torrent')).toBe('Anime')
  })
})

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
