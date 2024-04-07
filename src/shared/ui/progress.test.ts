import { render } from '@testing-library/svelte'
import { expect, test } from 'vitest'
import Progress from './progress.svelte'

test('Progress', () => {
  const { getByRole } = render(Progress, { value: 0.5 })
  const el = getByRole('progressbar') as HTMLProgressElement

  expect(el.value).toBe(0.5)
})
