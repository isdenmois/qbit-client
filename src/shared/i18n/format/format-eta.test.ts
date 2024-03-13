import { describe, it, expect } from 'vitest'
import { formatEta } from './format-eta'

describe('formatEta', () => {
  it('en', () => {
    expect(formatEta(-1, 'en')).toBe('0s')
    expect(formatEta(0, 'en')).toBe('0s')
    expect(formatEta(1, 'en')).toBe('1s')
    expect(formatEta(59, 'en')).toBe('59s')

    expect(formatEta(60, 'en')).toBe('1m')
    expect(formatEta(61, 'en')).toBe('1m 1s')
    expect(formatEta(100, 'en')).toBe('1m 40s')
    expect(formatEta(119, 'en')).toBe('1m 59s')
    expect(formatEta(120, 'en')).toBe('2m')
    expect(formatEta(121, 'en')).toBe('2m 1s')
    expect(formatEta(3599, 'en')).toBe('59m 59s')

    expect(formatEta(3600, 'en')).toBe('1h')
    expect(formatEta(3601, 'en')).toBe('1h')
    expect(formatEta(3666, 'en')).toBe('1h 1m')
    expect(formatEta(7199, 'en')).toBe('1h 59m')
    expect(formatEta(7200, 'en')).toBe('2h')

    expect(formatEta(86_399, 'en')).toBe('23h 59m')
    expect(formatEta(86_400, 'en')).toBe('1d')
    expect(formatEta(86_460, 'en')).toBe('1d')
    expect(formatEta(89_000, 'en')).toBe('1d')
    expect(formatEta(90_000, 'en')).toBe('1d 1h')
    expect(formatEta(100_000, 'en')).toBe('1d 3h')
  })

  it('ru', () => {
    expect(formatEta(-1, 'ru')).toBe('0с')
    expect(formatEta(0, 'ru')).toBe('0с')
    expect(formatEta(1, 'ru')).toBe('1с')
    expect(formatEta(59, 'ru')).toBe('59с')

    expect(formatEta(60, 'ru')).toBe('1м')
    expect(formatEta(61, 'ru')).toBe('1м 1с')
    expect(formatEta(100, 'ru')).toBe('1м 40с')
    expect(formatEta(119, 'ru')).toBe('1м 59с')
    expect(formatEta(120, 'ru')).toBe('2м')
    expect(formatEta(121, 'ru')).toBe('2м 1с')
    expect(formatEta(3599, 'ru')).toBe('59м 59с')

    expect(formatEta(3600, 'ru')).toBe('1ч')
    expect(formatEta(3601, 'ru')).toBe('1ч')
    expect(formatEta(3666, 'ru')).toBe('1ч 1м')
    expect(formatEta(7199, 'ru')).toBe('1ч 59м')
    expect(formatEta(7200, 'ru')).toBe('2ч')

    expect(formatEta(86_399, 'ru')).toBe('23ч 59м')
    expect(formatEta(86_400, 'ru')).toBe('1д')
    expect(formatEta(86_460, 'ru')).toBe('1д')
    expect(formatEta(89_000, 'ru')).toBe('1д')
    expect(formatEta(90_000, 'ru')).toBe('1д 1ч')
    expect(formatEta(100_000, 'ru')).toBe('1д 3ч')
  })
})
