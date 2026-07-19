import { render } from '@testing-library/vue'
import { expect, test } from 'vitest'
import Progress from './progress.vue'

test('Progress', () => {
  const { getByRole } = render(Progress, { props: { value: 0.5 } })
  const el = getByRole('progressbar') as HTMLProgressElement

  expect(el.value).toBe(0.5)
})
