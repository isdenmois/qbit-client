import { render } from '@testing-library/vue'
import { expect, test } from 'vitest'
import Icon from './icon.vue'

test('Icon', () => {
  const { container } = render(Icon, { props: { icon: 'icon-url.svg' } })
  const el = container.querySelector('use')

  expect(el?.getAttribute('xlink:href')).toBe('icon-url.svg#icon')
})
