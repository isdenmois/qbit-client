import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'
import { MainDataPollerKey, maindata } from '@/entities/stats'
import { pendingFile, setPendingFile } from '@/features/search'
import { api } from '@/shared/api'
import type { TorrentMetadata } from '@/shared/api/torrent'
import { mainDataPollerStub } from '@/shared/test'
import { useToasts } from '@/shared/ui'
import AddPage from './add.page.vue'

const mockMetadata: TorrentMetadata = {
  comment: '',
  created_by: '',
  hash: 'c63509c9888fc88de0026f721f58c596a511c554',
  info: {
    files: [
      { length: 100, path: 'file 1.txt' },
      { length: 150, path: 'file 2.txt' },
    ],
    length: 250,
    name: 'my files',
    piece_length: 16777216,
    pieces_num: 1,
    private: false,
  },
  infohash_v1: 'c63509c9888fc88de0026f721f58c596a511c554',
  infohash_v2: '',
  trackers: [],
  webseeds: [],
}

describe('AddPage pending file consumption', () => {
  const mockFile = new File(['data'], 'Pending Result.torrent', { type: 'application/x-bittorrent' })

  let router: Router

  beforeEach(() => {
    pendingFile.value = null
    maindata.value = null

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        { path: '/add', name: 'add', component: { template: '<div />' } },
      ],
    })

    vi.spyOn(router, 'replace').mockResolvedValue()
    vi.spyOn(api.torrent, 'add').mockResolvedValue({
      added_torrent_ids: [],
      failure_count: 0,
      pending_count: 0,
      success_count: 1,
    })
    vi.spyOn(api.torrent, 'addParsed').mockResolvedValue({
      added_torrent_ids: [],
      failure_count: 0,
      pending_count: 0,
      success_count: 1,
    })
  })

  afterEach(() => {
    pendingFile.value = null
  })

  const renderPage = () =>
    render(AddPage, {
      global: {
        plugins: [router],
        provide: { [MainDataPollerKey as symbol]: mainDataPollerStub },
      },
    })

  it('materializes the pending file on mount (no autoselect) and clears the pending store', async () => {
    // arrange
    setPendingFile(mockFile)

    // act
    const { findByText } = renderPage()

    // assert
    expect(findByText('Pending Result.torrent')).toBeTruthy()
    expect(pendingFile.value).toBeNull()
  })

  it('submits the pending file to api.torrent.add and navigates to /', async () => {
    // arrange
    setPendingFile(mockFile)

    const { findByRole } = renderPage()
    const submitButton = await findByRole('button', { name: 'Send' })

    // act
    await fireEvent.click(submitButton)

    // assert
    expect(api.torrent.add).toHaveBeenCalledWith([mockFile], 'Anime', true)
    expect(router.replace).toHaveBeenCalledWith('/')
  })
})

describe('AddPage priorities before creation', () => {
  const mockFile = new File(['data'], 'Pending Result.torrent', { type: 'application/x-bittorrent' })

  let router: Router

  beforeEach(() => {
    pendingFile.value = null
    maindata.value = null

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        { path: '/add', name: 'add', component: { template: '<div />' } },
      ],
    })

    vi.spyOn(router, 'replace').mockResolvedValue()
    vi.spyOn(api.torrent, 'add').mockResolvedValue({
      added_torrent_ids: [],
      failure_count: 0,
      pending_count: 0,
      success_count: 1,
    })
    vi.spyOn(api.torrent, 'parseMetadata').mockResolvedValue([mockMetadata])
    vi.spyOn(api.torrent, 'setPriority').mockResolvedValue('')
  })

  afterEach(() => {
    pendingFile.value = null
  })

  const renderPage = () =>
    render(AddPage, {
      global: {
        plugins: [router],
        provide: { [MainDataPollerKey as symbol]: mainDataPollerStub },
      },
    })

  const checkPriorities = async (page: ReturnType<typeof renderPage>) => {
    const checkbox = await page.findByRole('checkbox', { name: 'Select priorities before creation' })
    await fireEvent.click(checkbox)
  }

  it('parses metadata when the checkbox is ticked and shows the explorer', async () => {
    // arrange
    setPendingFile(mockFile)
    const page = renderPage()

    // act
    await checkPriorities(page)

    // assert
    expect(await page.findByText('my files')).toBeTruthy()
    expect(api.torrent.parseMetadata).toHaveBeenCalledWith(mockFile)
    expect(page.getByText('file 1.txt')).toBeTruthy()
    expect(page.getByText('file 2.txt')).toBeTruthy()
  })

  it('sends filePriorities built from the explorer priorities', async () => {
    // arrange
    setPendingFile(mockFile)
    const page = renderPage()
    await checkPriorities(page)
    await page.findByText('my files')

    // act
    await fireEvent.click(page.getByText('file 1.txt'))
    await fireEvent.click(page.getByRole('button', { name: 'Skip file' }))
    await fireEvent.click(page.getByRole('button', { name: 'Send' }))

    // assert: first file skipped, second keeps default normal priority
    expect(api.torrent.addParsed).toHaveBeenCalledWith(mockMetadata.hash, 'Anime', true, '0,1')
    expect(api.torrent.setPriority).not.toHaveBeenCalled()
    expect(router.replace).toHaveBeenCalledWith('/')
  })

  it('drops filePriorities after going back to the form', async () => {
    // arrange
    setPendingFile(mockFile)
    const page = renderPage()
    await checkPriorities(page)
    await page.findByText('my files')

    // act
    await fireEvent.click(page.getByRole('button', { name: 'Back to form' }))

    // assert: the checkbox is unchecked and the form is back
    const checkbox = page.getByRole('checkbox', { name: 'Select priorities before creation' }) as HTMLInputElement
    expect(checkbox.checked).toBe(false)

    await fireEvent.click(page.getByRole('button', { name: 'Send' }))
    expect(api.torrent.add).toHaveBeenCalledWith([mockFile], 'Anime', true)
  })

  it('shows a toast and reverts the checkbox when parsing fails', async () => {
    // arrange
    vi.spyOn(api.torrent, 'parseMetadata').mockRejectedValue(new Error('boom'))
    setPendingFile(mockFile)
    const page = renderPage()

    // act
    await checkPriorities(page)

    // assert: back on the form with the checkbox unticked, no explorer
    const toasts = useToasts()
    await waitFor(() => {
      expect(toasts.value.some((toast) => toast.message === 'Failed to parse torrent metadata')).toBe(true)
    })
    const checkbox = page.getByRole('checkbox', { name: 'Select priorities before creation' }) as HTMLInputElement
    expect(checkbox.checked).toBe(false)
    expect(page.queryByText('my files')).toBeNull()
  })
})
