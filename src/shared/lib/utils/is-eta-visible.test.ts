import { expect, test } from 'vitest'
import { isEtaVisible } from './is-eta-visible'

test('isEtaVisible', () => {
  expect(isEtaVisible(1)).toBeTruthy()
  expect(isEtaVisible(1_000_000)).toBeTruthy()

  expect(isEtaVisible(0)).toBeFalsy()
  expect(isEtaVisible(1_000_001)).toBeFalsy()
})
