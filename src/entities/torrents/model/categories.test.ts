import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/shared/api'
import { categories, guessCategory, loadCategories } from './categories'

vi.spyOn(api.torrent, 'categories').mockResolvedValue([
  { id: 'anime', name: 'Anime', savePath: '/downloads/anime' },
  { id: 'series', name: 'Series', savePath: '/downloads/series' },
  { id: 'games', name: 'Games', savePath: '/downloads/games' },
])

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

describe('loadCategories', () => {
  beforeEach(() => {
    categories.value = []
  })

  it('loads categories from the api', async () => {
    // act
    await loadCategories()

    // assert
    expect(categories.value).toHaveLength(3)
    expect(categories.value[0].name).toBe('Anime')
  })
})
