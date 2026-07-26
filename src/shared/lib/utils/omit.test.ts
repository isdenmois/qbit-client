import { expect, test } from 'vitest'
import { omit } from './omit'

test('omit removes a key from an object', () => {
  const obj = { a: 1, b: 2, c: 3 }

  const result = omit('b', obj)

  expect(result).toEqual({ a: 1, c: 3 })
})
