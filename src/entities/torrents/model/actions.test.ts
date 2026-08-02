import { beforeEach, describe, expect, it, vi } from 'vitest'
import { maindata } from '@/entities/stats'
import { mockMainData } from '@/shared/test'
import { decreasePriority, increasePriority } from './actions'

describe('priority actions', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    maindata.value = null
    mockMainData({
      torrents: {
        a: { state: 'queuedDL', priority: 2 },
        b: { state: 'queuedDL', priority: 1 },
      },
    })
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('Ok.'),
    } as unknown as Response)
  })

  it('optimistically increases priority and calls the api', async () => {
    // act
    await increasePriority('a')

    // assert
    expect(maindata.value?.torrents.a.priority).toBe(1)
    expect(maindata.value?.torrents.b.priority).toBe(2)
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/v2/torrents/increasePrio'), expect.anything())
    const [, init] = vi.mocked(fetch).mock.calls.find(([u]) => String(u).includes('increasePrio')) ?? []
    const body = init?.body as FormData
    expect(body.get('hashes')).toBe('a')
  })

  it('optimistically decreases priority and calls the api', async () => {
    // act
    await decreasePriority('b')

    // assert
    expect(maindata.value?.torrents.a.priority).toBe(1)
    expect(maindata.value?.torrents.b.priority).toBe(2)
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/v2/torrents/decreasePrio'), expect.anything())
  })

  it('clamps the increased priority at 1', async () => {
    // arrange
    mockMainData({
      torrents: {
        a: { state: 'queuedDL', priority: 1 },
      },
    })

    // act
    await increasePriority('a')

    // assert
    expect(maindata.value?.torrents.a.priority).toBe(1)
  })

  it('clamps the decreased priority', async () => {
    // arrange
    mockMainData({
      torrents: {
        a: { state: 'queuedDL', priority: 1 },
        b: { state: 'queuedDL', priority: 2 },
      },
    })

    // act
    await decreasePriority('b')

    // assert
    expect(maindata.value?.torrents.b.priority).toBe(2)
  })
})
