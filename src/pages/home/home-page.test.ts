import { render } from '@testing-library/vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { maindata } from '@/entities/stats'
import { filters } from '@/entities/torrents'
import { mockMainData } from '@/shared/test'
import HomePage from './home-page.vue'

describe('HomePage', () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/limits', component: { template: '<div />' } },
      { path: '/add', component: { template: '<div />' } },
      { path: '/torrent/:id', component: { template: '<div />' } },
    ],
  })

  const serverState = {
    alltime_dl: 0,
    alltime_ul: 0,
    dl_info_data: 0,
    dl_info_speed: 0,
    dl_info_limit: 0,
    dl_rate_limit: 0,
    free_space_on_disk: 0,
    global_ratio: '0',
    up_info_data: 0,
    up_info_speed: 0,
    up_info_limit: 0,
    up_rate_limit: 0,
  }

  beforeEach(() => {
    maindata.value = null
    filters.value = { uploaded: false, uploading: false, category: '' }
    mockMainData({ server_state: serverState, torrents: {} })
  })

  it('renders empty dashboard when no torrents exist', () => {
    const { queryByText } = render(HomePage, { global: { plugins: [router] } })

    expect(queryByText('Completed (0)')).toBeTruthy()
  })

  it('renders downloading and completed torrents', () => {
    // arrange
    mockMainData({
      torrents: {
        a: {
          name: 'Downloading Torrent',
          state: 'downloading',
          progress: 0.5,
          dlspeed: 1_000_000,
          upspeed: 0,
          completion_on: 0,
          category: 'anime',
          ratio: 0.5,
        } as const,
        b: {
          name: 'Completed Torrent',
          state: 'uploading',
          progress: 1,
          dlspeed: 0,
          upspeed: 100_000,
          completion_on: 1_700_000_000,
          category: 'series',
          ratio: 1.5,
        } as const,
      },
    })

    // act
    const { getByText } = render(HomePage, { global: { plugins: [router] } })

    // assert
    expect(getByText('Active (1)')).toBeTruthy()
    expect(getByText('Completed (1)')).toBeTruthy()
    expect(getByText('Downloading Torrent')).toBeTruthy()
    expect(getByText('Completed Torrent')).toBeTruthy()
  })
})
