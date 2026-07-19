import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import Card from './card.vue'

describe('Card', () => {
  it('should render title', () => {
    const { queryByRole } = render(Card, { props: { title: 'Hello there' } })

    expect(queryByRole('heading')?.textContent).toBe('Hello there')
  })

  it('should not render title if it is empty', () => {
    const { queryByRole } = render(Card, { props: { title: '' } })

    expect(queryByRole('heading')).toBeFalsy()
  })

  it('should not render title if it is not defined', () => {
    const { queryByRole } = render(Card)

    expect(queryByRole('heading')).toBeFalsy()
  })
})
