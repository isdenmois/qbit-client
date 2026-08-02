import { beforeEach, describe, expect, it, vi } from 'vitest'
import { app } from './app'

describe('app module', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('should fetch preferences', async () => {
    // arrange
    const preferences = {
      max_active_downloads: 4,
      max_ratio: 3,
      max_uploads_per_torrent: 10,
    }
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(preferences),
    } as unknown as Response)

    // act
    const result = await app.preferences()

    // assert
    expect(fetch).toHaveBeenCalledWith('/api/v2/app/preferences', expect.anything())
    expect(result).toEqual(preferences)
  })

  it('should set preferences with a json form field', async () => {
    // arrange
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('Ok.'),
    } as unknown as Response)

    // act
    await app.setPreferences({ max_ratio: 5 })

    // assert
    expect(fetch).toHaveBeenCalledWith('/api/v2/app/setPreferences', expect.anything())
    const [, init] = vi.mocked(fetch).mock.calls.find(([url]) => url === '/api/v2/app/setPreferences') ?? []
    const body = init?.body as FormData
    expect(body.get('json')).toBe(JSON.stringify({ max_ratio: 5 }))
  })
})
