import { describe, expect, it, vi } from 'vitest'
import { jk, type SearchResult } from './jk'

describe('downloadTorrent', () => {
  it('fetches the link and returns a File with the given name and bittorrent type', async () => {
    // arrange
    const blob = new Blob(['data'], { type: 'application/x-bittorrent' })
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response(blob))

    const item = {
      Title: 'Movie',
      Link: 'https://example.com/x.torrent',
    } as SearchResult

    // act
    const file = await jk.download(item)

    // assert
    expect(fetch).toHaveBeenCalledWith('https://example.com/x.torrent', { method: 'GET' })
    expect(file).toBeInstanceOf(File)
    expect(file.name).toBe('Movie.torrent')
    expect(file.type).toBe('application/x-bittorrent')
  })

  it('rejects when the response is not ok', async () => {
    // arrange
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response('404 not found', { status: 404 }))

    const item = {
      Title: 'Movie',
      Link: 'https://example.com/x.torrent',
    } as SearchResult

    // act & assert
    await expect(jk.download(item)).rejects.toThrow('404 not found')
  })
})
