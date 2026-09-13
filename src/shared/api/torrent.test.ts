import { beforeEach, describe, expect, it, vi } from 'vitest'
import { torrent } from './torrent'

describe('torrent add and parseMetadata', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('should parse metadata posting the file as multipart form data', async () => {
    // arrange
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    } as unknown as Response)
    const file = new File(['data'], 'sample.torrent', { type: 'application/x-bittorrent' })

    // act
    await torrent.parseMetadata(file)

    // assert
    expect(fetch).toHaveBeenCalledWith('/api/v2/torrents/parseMetadata', expect.anything())
    const [, init] = vi.mocked(fetch).mock.calls.find(([url]) => url === '/api/v2/torrents/parseMetadata') ?? []
    const body = init?.body as FormData
    expect(body.get('file')).toBe(file)
  })

  it('should add a torrent without filePriorities when none are given', async () => {
    // arrange
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ added_torrent_ids: [], failure_count: 0, pending_count: 0, success_count: 1 }),
    } as unknown as Response)
    const file = new File(['data'], 'sample.torrent', { type: 'application/x-bittorrent' })

    // act
    await torrent.add([file], 'Anime', true)

    // assert
    const [, init] = vi.mocked(fetch).mock.calls.find(([url]) => url === '/api/v2/torrents/add') ?? []
    const body = init?.body as FormData
    expect(body.get('category')).toBe('Anime')
    expect(body.get('filePriorities')).toBeNull()
  })

  it('should add a torrent with filePriorities when given', async () => {
    // arrange
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ added_torrent_ids: [], failure_count: 0, pending_count: 0, success_count: 1 }),
    } as unknown as Response)
    const url = '1234'

    // act
    await torrent.addParsed(url, 'Anime', true, '1,0')

    // assert
    const [, init] = vi.mocked(fetch).mock.calls.find(([url]) => url === '/api/v2/torrents/add') ?? []
    const body = init?.body as FormData
    expect(body.get('filePriorities')).toBe('1,0')
  })
})
