import { mainDataPollerStub, mockMainData } from '@test'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import {
  decreasePriority,
  deleteTorrent,
  increasePriority,
  MainDataPollerKey,
  maindata,
  toggleSequentialDownload,
} from '@/entities/torrents'
import { api } from '@/shared/api'
import TorrentDetailsInfo from './torrent-details-info.page.vue'

vi.mock('@/entities/torrents', async () => {
  const actual = await vi.importActual<typeof import('@/entities/torrents')>('@/entities/torrents')
  return {
    ...actual,
    deleteTorrent: vi.fn(),
    increasePriority: vi.fn(),
    decreasePriority: vi.fn(),
    toggleSequentialDownload: vi.fn(),
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

  const renderPage = () =>
    render(TorrentDetailsInfo, {
      global: {
        plugins: [router],
        provide: { [MainDataPollerKey as symbol]: mainDataPollerStub },
      },
    })

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
          priority: 3,
        } as const,
        def: {
          name: 'Other Torrent',
          priority: 4,
        } as const,
      },
    })
  })

  it('renders torrent information', async () => {
    // act
    const { getByText } = renderPage()

    // assert
    await waitFor(() => expect(getByText('Test Torrent')).toBeTruthy())
    expect(getByText('Information')).toBeTruthy()
    expect(getByText('#3')).toBeTruthy()
  })

  it('increases and decreases the torrent priority', async () => {
    // arrange
    vi.mocked(increasePriority).mockResolvedValue(undefined)
    vi.mocked(decreasePriority).mockResolvedValue(undefined)

    const { getByRole } = renderPage()

    await waitFor(() => getByRole('button', { name: 'Increase priority' }))

    // act
    await fireEvent.click(getByRole('button', { name: 'Increase priority' }))
    await fireEvent.click(getByRole('button', { name: 'Decrease priority' }))

    // assert
    expect(increasePriority).toHaveBeenCalledWith('abc')
    expect(decreasePriority).toHaveBeenCalledWith('abc')
  })

  it('toggles sequential download for an unfinished torrent', async () => {
    // arrange
    vi.mocked(toggleSequentialDownload).mockResolvedValue(undefined)

    const { getByRole } = renderPage()

    const checkbox = await waitFor(() => getByRole('checkbox', { name: 'Sequential Download' }))

    // act
    await fireEvent.click(checkbox)

    // assert
    expect(toggleSequentialDownload).toHaveBeenCalledWith('abc')
  })

  it('toggles sequential download when clicking the whole row', async () => {
    // arrange
    vi.mocked(toggleSequentialDownload).mockResolvedValue(undefined)

    const { getByText } = renderPage()

    const title = await waitFor(() => getByText('Sequential Download'))

    // act
    await fireEvent.click(title)

    // assert
    expect(toggleSequentialDownload).toHaveBeenCalledWith('abc')
  })

  it('does not show the sequential download toggle for a completed torrent', async () => {
    // arrange
    maindata.value = null
    mockMainData({
      torrents: {
        abc: { name: 'Test Torrent', progress: 1 },
      },
    })

    const { getByText, queryByRole } = renderPage()

    // act
    await waitFor(() => getByText('Test Torrent'))

    // assert
    expect(queryByRole('checkbox', { name: 'Sequential Download' })).toBeNull()
  })

  it('disables decrease priority when the torrent is at maximum priority', async () => {
    // arrange
    maindata.value = null
    mockMainData({
      torrents: {
        abc: { name: 'Test Torrent', priority: 2 },
        def: { priority: 1 },
      },
    })

    const { getByRole } = renderPage()

    // act
    await waitFor(() => getByRole('button', { name: 'Decrease priority' }))

    // assert
    expect(getByRole('button', { name: 'Decrease priority' }).getAttribute('disabled')).not.toBeNull()
    expect(getByRole('button', { name: 'Increase priority' }).getAttribute('disabled')).toBeNull()
  })

  it('confirms and deletes a torrent', async () => {
    // arrange
    vi.mocked(deleteTorrent).mockResolvedValue(undefined)

    const { getByText, getByRole, getAllByRole } = renderPage()

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
