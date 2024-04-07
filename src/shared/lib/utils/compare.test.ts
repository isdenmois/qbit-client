import { compare } from './compare'
import { expect, test } from 'vitest'

test('compare', () => {
  const a = { value: 1 }
  const b = { value: 2 }

  const comparator = compare((o: typeof a) => o.value)

  expect(comparator(a, b)).toBe(-1)
  expect(comparator(b, a)).toBe(1)
  expect(comparator(a, a)).toBe(0)
  expect(comparator(b, b)).toBe(0)
})
