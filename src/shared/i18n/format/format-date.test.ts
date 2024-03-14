import { expect, test } from 'vitest'
import { formatDate } from './format-date'

test('formatDate', () => {
  expect(formatDate(1)).toBe('01.01.1970')
  expect(formatDate(1600000000)).toBe('13.09.2020')
})
