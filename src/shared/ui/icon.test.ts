import { render } from '@testing-library/svelte'
import { expect, test } from 'vitest'
import Icon from './icon.svelte'

test('Icon', () => {
  const { container } = render(Icon, { icon: 'icon-url.svg' })
  const el = container.querySelector('use')

  expect(el?.getAttribute('xlink:href')).toBe('icon-url.svg#icon')
})
