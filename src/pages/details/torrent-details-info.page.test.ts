import { fireEvent, render, waitFor } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { maindata } from '@/entities/stats'
import { deleteTorrent } from '@/entities/torrents'
import { api } from '@/shared/api'
import { mockMainData } from '@/shared/test'
import TorrentDetailsInfo from './torrent-details-info.page.vue'

vi.mock('@/entities/torrents', async () => {
  const actual = await vi.importActual<typeof import('@/entities/torrents')>('@/entities/torrents')
  return {
    ...actual,
    deleteTorrent: vi.fn(),
  }
})

vi.spyOn(api.torrent, 'properties').mockResolvedValue({ comment: '' })

describe('TorrentDetailsInfo', () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/torrent/:id', component: { template: '<div />' } },
    ],
  })

  vi.spyOn(router, 'replace').mockResolvedValue(undefined)

  beforeEach(async () => {
    await router.push('/torrent/abc')
    maindata.value = null
    mockMainData({
      torrents: {
        abc: {
          name: 'Test Torrent',
          state: 'downloading',
          progress: 0.5,
          size: 1_000_000,
          added_on: 1_700_000_000,
          uploaded: 100_000,
          ratio: 0.5,
          popularity: 1,
          dlspeed: 1_000,
          downloaded: 500_000,
          num_seeds: 10,
          eta: 3600,
          save_path: '/downloads',
          comment: '',
          completion_on: 0,
          num_complete: 0,
          num_leechs: 0,
          upspeed: 0,
        } as const,
      },
    })
  })

  it('renders torrent information', async () => {
    // act
    const { getByText } = render(TorrentDetailsInfo, {
      global: { plugins: [router] },
    })

    // assert
    await waitFor(() => expect(getByText('Test Torrent')).toBeTruthy())
    expect(getByText('Information')).toBeTruthy()
  })

  it('confirms and deletes a torrent', async () => {
    // arrange
    vi.mocked(deleteTorrent).mockResolvedValue(undefined)

    const { getByText, getByRole, getAllByRole } = render(TorrentDetailsInfo, {
      global: { plugins: [router] },
    })

    await waitFor(() => getByText('Test Torrent'))

    // act
    await fireEvent.click(getByRole('button', { name: 'Delete' }))
    await fireEvent.click(getAllByRole('button', { name: 'Delete' })[1])

    // assert
    await waitFor(() => {
      expect(deleteTorrent).toHaveBeenCalledWith('abc', true)
      expect(router.replace).toHaveBeenCalledWith('/')
    })
  })
})
