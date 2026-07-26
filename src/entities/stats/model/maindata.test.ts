import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/shared/api'
import { setAuthState } from '@/shared/api/auth-state'
import type { ServerState } from '@/shared/api/sync'
import { maindata, updateMainData } from './maindata'
import { createMainDataPoller } from './maindata-poller'

describe('updateMainData', () => {
  beforeEach(() => {
    maindata.value = null
  })

  it('sets maindata from a full update', () => {
    // act
    updateMainData({
      full_update: true,
      rid: 1,
      server_state: { dl_info_speed: 100 },
      torrents: { a: { name: 'A' } },
    })

    // assert
    expect(maindata.value?.rid).toBe(1)
    expect(maindata.value?.server_state.dl_info_speed).toBe(100)
    expect(maindata.value?.torrents.a.name).toBe('A')
  })

  it('merges incremental updates', () => {
    // arrange
    updateMainData({
      full_update: true,
      rid: 1,
      server_state: { dl_info_speed: 100 },
      torrents: { a: { name: 'A' } },
    })

    // act
    updateMainData({
      rid: 2,
      server_state: { dl_info_speed: 200 },
      torrents: { b: { name: 'B' } },
    })

    // assert
    expect(maindata.value?.server_state.dl_info_speed).toBe(200)
    expect(maindata.value?.torrents.a.name).toBe('A')
    expect(maindata.value?.torrents.b.name).toBe('B')
  })
})

describe('createMainDataPoller', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    maindata.value = null
    setAuthState('logged-in')
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllTimers()
    vi.restoreAllMocks()
    setAuthState('init')
  })

  it('polls maindata and updates the store', async () => {
    // arrange
    vi.spyOn(api.sync, 'maindata').mockResolvedValue({
      full_update: true,
      rid: 1,
      server_state: {} as ServerState,
      torrents: {},
    })

    const poller = createMainDataPoller()

    // act
    poller.start()
    await vi.advanceTimersByTimeAsync(0)

    // assert
    expect(api.sync.maindata).toHaveBeenCalledWith(0)
    expect(maindata.value?.rid).toBe(1)

    poller.destroy()
  })

  it('stops polling when stopped', async () => {
    // arrange
    vi.spyOn(api.sync, 'maindata').mockResolvedValue({
      full_update: true,
      rid: 1,
      server_state: {} as ServerState,
      torrents: {},
    })

    const poller = createMainDataPoller()

    // act
    poller.start()
    poller.stop()
    await vi.advanceTimersByTimeAsync(10_000)

    // assert
    expect(api.sync.maindata).toHaveBeenCalledTimes(1)

    poller.destroy()
  })

  it('does not poll when auth is logged out', async () => {
    // arrange
    const spy = vi.spyOn(api.sync, 'maindata').mockResolvedValue({
      full_update: true,
      rid: 1,
      server_state: {} as ServerState,
      torrents: {},
    })
    setAuthState('logged-out')

    const poller = createMainDataPoller()

    // act
    poller.start()
    await vi.advanceTimersByTimeAsync(10_000)

    // assert
    expect(spy).not.toHaveBeenCalled()

    poller.destroy()
  })

  it('handles errors without crashing', async () => {
    // arrange
    const spy = vi.spyOn(api.sync, 'maindata').mockRejectedValue(new Error('network'))
    const poller = createMainDataPoller()

    // act
    poller.start()
    await vi.advanceTimersByTimeAsync(0)

    // assert
    expect(spy).toHaveBeenCalledTimes(1)

    poller.destroy()
  })
})
