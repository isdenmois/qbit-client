import { render } from '@testing-library/svelte'
import { mockMainData } from 'shared/test'
import { describe, expect, it } from 'vitest'
import SpaceCard from './space-card.svelte'

describe('SpaceCard', () => {
  it('should render data from store', () => {
    mockMainData({
      server_state: {
        free_space_on_disk: 3 * 1024 * 1024 * 1024,
      },
    })

    const { getByRole, getByText } = render(SpaceCard)
    const el = getByRole('heading')

    expect(el.textContent).toBe('Free Space')
    expect(getByText('3 GB')).toBeDefined()
  })
})
