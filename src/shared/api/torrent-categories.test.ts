import { beforeEach, describe, expect, it, vi } from 'vitest'
import { torrent } from './torrent'

describe('torrent category management', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('should create a category with name and savePath', async () => {
    // arrange
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('Ok.'),
    } as unknown as Response)

    // act
    await torrent.createCategory('movies', '/downloads/movies')

    // assert
    expect(fetch).toHaveBeenCalledWith('/api/v2/torrents/createCategory', expect.anything())
    const [, init] = vi.mocked(fetch).mock.calls.find(([url]) => url === '/api/v2/torrents/createCategory') ?? []
    const body = init?.body as FormData
    expect(body.get('category')).toBe('movies')
    expect(body.get('savePath')).toBe('/downloads/movies')
  })

  it('should edit a category savePath', async () => {
    // arrange
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('Ok.'),
    } as unknown as Response)

    // act
    await torrent.editCategory('movies', '/new/path')

    // assert
    expect(fetch).toHaveBeenCalledWith('/api/v2/torrents/editCategory', expect.anything())
    const [, init] = vi.mocked(fetch).mock.calls.find(([url]) => url === '/api/v2/torrents/editCategory') ?? []
    const body = init?.body as FormData
    expect(body.get('category')).toBe('movies')
    expect(body.get('savePath')).toBe('/new/path')
  })

  it('should remove categories joined by newline', async () => {
    // arrange
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('Ok.'),
    } as unknown as Response)

    // act
    await torrent.removeCategories('movies', 'games')

    // assert
    expect(fetch).toHaveBeenCalledWith('/api/v2/torrents/removeCategories', expect.anything())
    const [, init] = vi.mocked(fetch).mock.calls.find(([url]) => url === '/api/v2/torrents/removeCategories') ?? []
    const body = init?.body as FormData
    expect(body.get('categories')).toBe('movies\ngames')
  })
})
