import { describe, expect, it } from 'vitest'
import { guessCategory } from './guess-category'

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
