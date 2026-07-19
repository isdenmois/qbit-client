import { render } from '@testing-library/svelte'
import { mockMainData } from 'shared/test'
import { describe, expect, it } from 'vitest'
import LimitsCard from './limits-card.svelte'

describe('LimitsCard', () => {
  it('should render data from store', () => {
    mockMainData({
      server_state: {
        up_rate_limit: 1024,
        dl_rate_limit: 2048,
      },
    })

    const { getByRole, getByText } = render(LimitsCard)
    const el = getByRole('heading')

    expect(el.textContent).toBe('Limits')
    expect(getByText('2 KB')).toBeDefined()
    expect(getByText('1 KB')).toBeDefined()
  })
})
