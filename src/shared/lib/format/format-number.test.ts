import { expect, test } from 'vitest'
import { formatNumber, formatNumberUnit } from './format-number'

test('formatNumber', () => {
  expect(formatNumber(0)).toBe('0')
  expect(formatNumber(1.5)).toBe('1,5')
  expect(formatNumber(1.575)).toBe('1,58')
  expect(formatNumber(1500)).toBe('1 500')
  expect(formatNumber(1_000_000)).toBe('1 000 000')
})

test('formatNumberUnit', () => {
  expect(formatNumberUnit(0, 'a')).toBe('0 a')
  expect(formatNumberUnit(1.5, 'b')).toBe('1,5 b')
  expect(formatNumberUnit(9.94, 'c')).toBe('9,94 c')
  expect(formatNumberUnit(9.95, 'd')).toBe('10 d')
  expect(formatNumberUnit(11.81, 'd')).toBe('11,8 d')
})
