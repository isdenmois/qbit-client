import { fireEvent, render, waitFor } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { maindata } from '@/entities/stats'
import { mockMainData } from '@/shared/test'
import type { Torrent } from '../model'
import TorrentItem from './torrent-item.vue'

describe('TorrentItem', () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/torrent/:id', component: { template: '<div />' } },
    ],
  })

  const renderItem = () =>
    render(TorrentItem, {
      props: { torrent: { ...(maindata.value?.torrents.abc ?? {}), id: 'abc' } as Torrent },
      global: { plugins: [router] },
    })

  beforeEach(() => {
    vi.restoreAllMocks()
    maindata.value = null
    mockMainData({
      torrents: {
        abc: {
          name: 'Paused Torrent',
          state: 'stoppedDL',
          progress: 0.5,
          size: 1_000_000,
        },
      },
    })
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('Ok.'),
    } as unknown as Response)
  })

  it('resumes a paused torrent from the row', async () => {
    // arrange
    const { getByRole } = renderItem()

    // act
    await fireEvent.click(getByRole('button', { name: 'Resume torrent' }))

    // assert
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/v2/torrents/start'), expect.anything()),
    )

    const body = vi.mocked(fetch).mock.calls.find(([url]) => String(url).includes('/api/v2/torrents/start'))?.[1]?.body
    expect(body).toBeInstanceOf(FormData)
    expect((body as FormData).get('hashes')).toBe('abc')
  })

  it('hides the resume button for completed torrents', () => {
    // arrange
    mockMainData({
      torrents: {
        abc: {
          name: 'Completed Torrent',
          state: 'stoppedUP',
          progress: 1,
          size: 1_000_000,
        },
      },
    })

    // act
    const { queryByRole } = renderItem()

    // assert
    expect(queryByRole('button', { name: 'Resume torrent' })).toBeNull()
  })
})
