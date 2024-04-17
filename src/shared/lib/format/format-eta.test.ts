import { expect, test } from 'vitest'
import { formatEta } from './format-eta'

test('formatEta', () => {
  expect(formatEta(-1)).toBe('0s')
  expect(formatEta(0)).toBe('0s')
  expect(formatEta(1)).toBe('1s')
  expect(formatEta(59)).toBe('59s')

  expect(formatEta(60)).toBe('1m')
  expect(formatEta(61)).toBe('1m 1s')
  expect(formatEta(100)).toBe('1m 40s')
  expect(formatEta(119)).toBe('1m 59s')
  expect(formatEta(120)).toBe('2m')
  expect(formatEta(121)).toBe('2m 1s')
  expect(formatEta(3599)).toBe('59m 59s')

  expect(formatEta(3600)).toBe('1h')
  expect(formatEta(3601)).toBe('1h')
  expect(formatEta(3666)).toBe('1h 1m')
  expect(formatEta(7199)).toBe('1h 59m')
  expect(formatEta(7200)).toBe('2h')

  expect(formatEta(86_399)).toBe('23h 59m')
  expect(formatEta(86_400)).toBe('1d')
  expect(formatEta(86_460)).toBe('1d')
  expect(formatEta(89_000)).toBe('1d')
  expect(formatEta(90_000)).toBe('1d 1h')
  expect(formatEta(100_000)).toBe('1d 3h')
})
