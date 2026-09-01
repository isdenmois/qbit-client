import { fireEvent, render, waitFor } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { maindata } from '@/entities/stats'
import { api } from '@/shared/api'
import { mockMainData } from '@/shared/test'
import TorrentContent from './torrent-content.page.vue'

const createFiles = () => [
  { index: 0, name: 'folder/file1.txt', priority: 1, progress: 0, size: 100 },
  { index: 1, name: 'folder/file2.txt', priority: 7, progress: 0, size: 200 },
  { index: 2, name: 'folder/sub/deep.txt', priority: 0, progress: 0, size: 300 },
  { index: 3, name: 'other/file3.txt', priority: 0, progress: 0, size: 400 },
]

vi.spyOn(api.torrent, 'files').mockImplementation(() => Promise.resolve(createFiles()))
vi.spyOn(api.torrent, 'setPriority').mockResolvedValue('')

describe('TorrentContent', () => {
  const router = createRouter({
    history: createMemoryHistory('/torrent/abc'),
    routes: [{ path: '/torrent/:id', component: { template: '<div />' } }],
  })

  beforeEach(async () => {
    await router.push('/torrent/abc')
    maindata.value = null
    vi.clearAllMocks()
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

  it('renders a tree from flat file list', async () => {
    // act
    const { getByText } = render(TorrentContent, { global: { plugins: [router] } })

    // assert
    await waitFor(() => {
      expect(getByText('folder')).toBeTruthy()
      expect(getByText('other')).toBeTruthy()
    })
  })

  it('selects a folder with a right-click', async () => {
    // act
    const { getByText, container } = render(TorrentContent, { global: { plugins: [router] } })

    await waitFor(() => getByText('folder'))
    const row = container.querySelector('li.folder')
    await fireEvent.contextMenu(row as Element)

    // assert
    expect(row?.classList.contains('selected')).toBe(true)
  })

  it('toggles folder selection with right-click while selecting', async () => {
    // act
    const { getByText, container } = render(TorrentContent, { global: { plugins: [router] } })

    await waitFor(() => getByText('folder'))
    const row = container.querySelector('li.folder')
    await fireEvent.contextMenu(row as Element)
    await fireEvent.contextMenu(row as Element)

    // assert
    expect(row?.classList.contains('selected')).toBe(false)
  })

  it('keeps navigation locked while a folder is selected', async () => {
    // act
    const { getByText, queryByText, container } = render(TorrentContent, { global: { plugins: [router] } })

    await waitFor(() => getByText('folder'))
    const row = container.querySelector('li.folder')
    await fireEvent.contextMenu(row as Element)
    await fireEvent.click(getByText('folder'))

    // assert
    await waitFor(() => {
      expect(queryByText('file1.txt')).toBeFalsy()
    })
  })

  it('expands selected folder recursively when setting priority', async () => {
    // act
    const { getByText, getByRole } = render(TorrentContent, { global: { plugins: [router] } })

    await waitFor(() => getByText('folder'))
    await fireEvent.contextMenu(getByText('folder'))

    await fireEvent.click(getByRole('button', { name: 'Set maximum priority' }))

    // assert: recursive expansion sends all descendant indexes, not siblings
    await waitFor(() => {
      expect(api.torrent.setPriority).toHaveBeenCalledWith(
        'abc',
        expect.arrayContaining([
          expect.objectContaining({ index: 0 }),
          expect.objectContaining({ index: 1 }),
          expect.objectContaining({ index: 2 }),
        ]),
        7,
      )
      expect(api.torrent.setPriority).not.toHaveBeenCalledWith(
        'abc',
        expect.arrayContaining([expect.objectContaining({ index: 3 })]),
        7,
      )
    })
  })

  it('applies priority to descendant files and clears selection', async () => {
    // act
    const { getByText, getByRole, queryByText, queryByRole } = render(TorrentContent, {
      global: { plugins: [router] },
    })

    await waitFor(() => getByText('folder'))
    await fireEvent.contextMenu(getByText('folder'))
    await fireEvent.click(getByRole('button', { name: 'Set maximum priority' }))

    await fireEvent.click(getByText('folder'))
    await waitFor(() => getByText('sub'))
    await fireEvent.click(getByText('sub'))
    await waitFor(() => getByText('deep.txt'))

    // assert: priority set on the descendant file node, selection cleared (no bottom bar)
    await waitFor(() => {
      expect(queryByText('deep.txt')).toBeTruthy()
      expect(api.torrent.setPriority).toHaveBeenCalledTimes(1)
    })
    expect(queryByRole('button', { name: 'Set maximum priority' })).toBeNull()
  })

  it('unlocks navigation after toggling the folder off', async () => {
    // act
    const { getByText, container } = render(TorrentContent, { global: { plugins: [router] } })

    await waitFor(() => getByText('folder'))
    const row = container.querySelector('li.folder')
    await fireEvent.contextMenu(row as Element)
    await fireEvent.contextMenu(row as Element)
    await fireEvent.click(getByText('folder'))

    // assert
    await waitFor(() => {
      expect(getByText('file1.txt')).toBeTruthy()
    })
  })

  it('navigates into a folder and back', async () => {
    // act
    const { getByText, queryByText } = render(TorrentContent, { global: { plugins: [router] } })

    await waitFor(() => getByText('folder'))
    await fireEvent.click(getByText('folder'))

    // assert
    await waitFor(() => {
      expect(getByText('file1.txt')).toBeTruthy()
      expect(getByText('file2.txt')).toBeTruthy()
      expect(queryByText('other')).toBeFalsy()
    })

    // act
    await fireEvent.click(getByText('..'))

    // assert
    await waitFor(() => expect(getByText('other')).toBeTruthy())
  })

  it('sets priority on selected files', async () => {
    // act
    const { getByText, getByRole } = render(TorrentContent, { global: { plugins: [router] } })

    await waitFor(() => getByText('folder'))
    await fireEvent.click(getByText('folder'))
    await waitFor(() => getByText('file1.txt'))
    await fireEvent.click(getByText('file1.txt'))

    await fireEvent.click(getByRole('button', { name: 'Set maximum priority' }))

    // assert
    await waitFor(() => {
      expect(api.torrent.setPriority).toHaveBeenCalledWith(
        'abc',
        expect.arrayContaining([expect.objectContaining({ index: 0 })]),
        7,
      )
    })
  })

  it('hides percent for skipped files', async () => {
    // arrange
    const { getByText, queryByText } = render(TorrentContent, { global: { plugins: [router] } })

    await waitFor(() => getByText('folder'))
    await fireEvent.click(getByText('folder'))

    // act
    await fireEvent.click(getByText('sub'))

    // assert
    expect(getByText('deep.txt')).toBeTruthy()
    expect(queryByText('0%')).toBeFalsy()
  })
})
