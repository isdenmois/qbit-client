import { render } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import Card from './card.svelte'

describe('Card', () => {
  it('should render title', () => {
    const { getByRole } = render(Card, { title: 'Hello there' })
    const el = getByRole('heading')

    expect(el.textContent).toBe('Hello there')
  })

  it('should not render title if it is empty', () => {
    const { queryByRole } = render(Card, { title: '' })

    expect(queryByRole('heading')).toBeFalsy()
  })

  it('should not render title if it is not defined', () => {
    const { queryByRole } = render(Card)

    expect(queryByRole('heading')).toBeFalsy()
  })
})
