import { render } from '@testing-library/vue'
import { mockMainData } from 'shared/test'
import { describe, expect, it } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import LimitsCard from './limits-card.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/limits', component: { template: '<div />' } },
  ],
})

describe('LimitsCard', () => {
  it('should render data from store', async () => {
    mockMainData({
      server_state: {
        up_rate_limit: 1024,
        dl_rate_limit: 2048,
      },
    })

    const { getByRole, getByText } = render(LimitsCard, {
      global: {
        plugins: [router],
      },
    })
    const el = getByRole('heading')

    expect(el.textContent).toBe('Limits')
    expect(getByText('2 KB')).toBeDefined()
    expect(getByText('1 KB')).toBeDefined()
  })
})
