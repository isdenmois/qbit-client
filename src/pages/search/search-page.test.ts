import { fireEvent, type RenderResult, render, waitFor } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { pendingFile } from '@/features/search'
import { api } from '@/shared/api'
import SearchPage from './search-page.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/search', component: { template: '<div />' } },
    { path: '/add', component: { template: '<div />' } },
  ],
})
const results = [
  {
    Guid: '1',
    Title: 'Few Seeders',
    Details: 'https://example.com/1',
    Link: 'https://example.com/dl/1',
    Seeders: 5,
    Peers: 10,
    PublishDate: '2024-01-01',
    Size: 1000,
    Tracker: 'Tracker',
  },
  {
    Guid: '2',
    Title: 'Many Seeders',
    Details: 'https://example.com/2',
    Link: 'https://example.com/dl/2',
    Seeders: 50,
    Peers: 100,
    PublishDate: '2024-01-02',
    Size: 1000,
    Tracker: 'Tracker',
  },
]

describe('SearchPage', () => {
  let renderResult: RenderResult
  let input: HTMLInputElement
  let form: HTMLFormElement
  let container: Element

  beforeEach(() => {
    pendingFile.value = null
    vi.spyOn(router, 'push').mockResolvedValue(undefined)
    vi.spyOn(router, 'replace').mockResolvedValue(undefined)
    vi.spyOn(api.jk, 'search').mockResolvedValue({ Results: [] })
    vi.spyOn(api.jk, 'search').mockResolvedValue({
      Results: results,
    })

    renderResult = render(SearchPage, {
      global: { plugins: [router] },
    })
    container = renderResult.container
    input = renderResult.getByPlaceholderText('Query')
    form = container.querySelector('form') as HTMLFormElement
  })

  it('renders search results sorted by seeders by default', async () => {
    // arrange
    const { getByText } = renderResult

    // act
    await fireEvent.update(input, 'test')
    await fireEvent.submit(form)

    // assert
    expect(getByText('Found 2')).toBeTruthy()
    expect(getByText('Many Seeders')).toBeTruthy()
    expect(getByText('Few Seeders')).toBeTruthy()
  })

  it('downloads a result and navigates to add', async () => {
    // arrange
    const file = new File(['data'], 'result.torrent', { type: 'application/x-bittorrent' })
    const item = results[0]

    vi.spyOn(api.jk, 'download').mockResolvedValue(file)

    await fireEvent.update(input, 'test')
    await fireEvent.submit(form)

    // act
    await fireEvent.contextMenu(container.querySelector(`a[href="${item.Link}"]`) as HTMLAnchorElement)

    // assert
    await waitFor(() => {
      expect(pendingFile.value).toBe(file)
      expect(router.push).toHaveBeenCalledWith('/add')
    })
  })
})
