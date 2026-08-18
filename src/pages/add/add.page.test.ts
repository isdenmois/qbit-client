import { fireEvent, render } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'
import { categories } from '@/entities/torrents'
import { pendingFile, setPendingFile } from '@/features/search'
import { api } from '@/shared/api'
import AddPage from './add.page.vue'

describe('AddPage pending file consumption', () => {
  const mockFile = new File(['data'], 'Pending Result.torrent', { type: 'application/x-bittorrent' })

  let router: Router

  beforeEach(() => {
    pendingFile.value = null
    categories.value = []

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
  })

  afterEach(() => {
    pendingFile.value = null
  })

  const renderPage = () => render(AddPage, { global: { plugins: [router] } })

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
