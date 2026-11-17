import { render } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import type { UseUpdateCheckDeps } from './update-check'
import { createUpdateChecker, fetchDeployedVersion, RELOAD_GUARD_KEY, useUpdateCheck } from './update-check'

const createStorage = (initial: Record<string, string> = {}) => {
  const store = new Map(Object.entries(initial))

  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    store,
  }
}

const mountUpdateCheck = (deps: UseUpdateCheckDeps) => {
  const Test = defineComponent({
    setup() {
      useUpdateCheck(deps)
      return () => h('div')
    },
  })

  return render(Test)
}

describe('fetchDeployedVersion', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('reads version.json bypassing the http cache', async () => {
    // arrange
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ version: 'abc' }),
    } as unknown as Response)

    // act
    const version = await fetchDeployedVersion()

    // assert
    expect(version).toBe('abc')
    expect(fetch).toHaveBeenCalledWith('/version.json', { cache: 'no-store' })
  })

  it('returns null when the endpoint responds with an error', async () => {
    // arrange
    vi.spyOn(global, 'fetch').mockResolvedValue({ ok: false } as unknown as Response)

    // act
    const version = await fetchDeployedVersion()

    // assert
    expect(version).toBeNull()
  })

  it('returns null when the payload has no usable version', async () => {
    // arrange
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ version: 1 }),
    } as unknown as Response)

    // act
    const version = await fetchDeployedVersion()

    // assert
    expect(version).toBeNull()
  })

  it('returns null when the request fails', async () => {
    // arrange
    vi.spyOn(global, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'))

    // act
    const version = await fetchDeployedVersion()

    // assert
    expect(version).toBeNull()
  })
})

describe('createUpdateChecker', () => {
  it('reloads when the deployed version differs from the running one', async () => {
    // arrange
    const fetchVersion = vi.fn().mockResolvedValue('newer')
    const reload = vi.fn()
    const checker = createUpdateChecker({
      currentVersion: 'older',
      fetchVersion,
      reload,
      storage: createStorage(),
    })

    // act
    const reloaded = await checker.check()

    // assert
    expect(reloaded).toBe(true)
    expect(reload).toHaveBeenCalledOnce()
  })

  it('does not reload when the deployed version matches the running one', async () => {
    // arrange
    const reload = vi.fn()
    const checker = createUpdateChecker({
      currentVersion: 'same',
      fetchVersion: vi.fn().mockResolvedValue('same'),
      reload,
      storage: createStorage(),
    })

    // act
    const reloaded = await checker.check()

    // assert
    expect(reloaded).toBe(false)
    expect(reload).not.toHaveBeenCalled()
  })

  it('does not reload when the deployed version cannot be fetched', async () => {
    // arrange
    const reload = vi.fn()
    const checker = createUpdateChecker({
      currentVersion: 'same',
      fetchVersion: vi.fn().mockResolvedValue(null),
      reload,
      storage: createStorage(),
    })

    // act
    const reloaded = await checker.check()

    // assert
    expect(reloaded).toBe(false)
    expect(reload).not.toHaveBeenCalled()
  })

  it('does not reload twice for the same deployed version', async () => {
    // arrange
    const reload = vi.fn()
    const storage = createStorage()
    const checker = createUpdateChecker({
      currentVersion: 'older',
      fetchVersion: vi.fn().mockResolvedValue('newer'),
      reload,
      storage,
    })

    // act
    await checker.check()
    const reloadedAgain = await checker.check()

    // assert
    expect(reload).toHaveBeenCalledOnce()
    expect(reloadedAgain).toBe(false)
  })

  it('skips reloading when the same deployed version was already loaded once', async () => {
    // arrange
    const reload = vi.fn()
    const checker = createUpdateChecker({
      currentVersion: 'older',
      fetchVersion: vi.fn().mockResolvedValue('newer'),
      reload,
      storage: createStorage({ [RELOAD_GUARD_KEY]: 'newer' }),
    })

    // act
    const reloaded = await checker.check()

    // assert
    expect(reloaded).toBe(false)
    expect(reload).not.toHaveBeenCalled()
  })

  it('does not run concurrent checks', async () => {
    // arrange
    let resolveVersion: (version: string | null) => void = () => {}
    const fetchVersion = vi.fn(
      () =>
        new Promise<string | null>((resolve) => {
          resolveVersion = resolve
        }),
    )
    const checker = createUpdateChecker({
      currentVersion: 'same',
      fetchVersion,
      reload: vi.fn(),
      storage: createStorage(),
    })

    // act
    const first = checker.check()
    const second = await checker.check()
    resolveVersion('same')
    await first

    // assert
    expect(fetchVersion).toHaveBeenCalledOnce()
    expect(second).toBe(false)
  })

  it('reloads when the version is unreachable in storage', async () => {
    // arrange
    const reload = vi.fn()
    const checker = createUpdateChecker({
      currentVersion: 'older',
      fetchVersion: vi.fn().mockResolvedValue('newer'),
      reload,
      storage: {
        getItem: () => {
          throw new Error('storage disabled')
        },
        setItem: () => {
          throw new Error('storage disabled')
        },
      },
    })

    // act
    const reloaded = await checker.check()

    // assert
    expect(reloaded).toBe(true)
    expect(reload).toHaveBeenCalledOnce()
  })
})

describe('useUpdateCheck', () => {
  let visibilityState: DocumentVisibilityState = 'visible'

  beforeEach(() => {
    visibilityState = 'visible'
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => visibilityState })
  })

  afterEach(() => {
    Reflect.deleteProperty(document, 'visibilityState')
    Reflect.deleteProperty(document, 'readyState')
  })

  it('waits for the load event before checking', async () => {
    // arrange
    Object.defineProperty(document, 'readyState', { configurable: true, get: () => 'loading' })
    const fetchVersion = vi.fn().mockResolvedValue('current')
    mountUpdateCheck({ fetchVersion, reload: vi.fn(), storage: createStorage() })
    await new Promise((resolve) => setTimeout(resolve, 0))

    // assert
    expect(fetchVersion).not.toHaveBeenCalled()

    // act
    Object.defineProperty(document, 'readyState', { configurable: true, get: () => 'complete' })
    window.dispatchEvent(new Event('load'))

    // assert
    await vi.waitFor(() => expect(fetchVersion).toHaveBeenCalledOnce())
  })

  it('reloads on mount when a newer build has been deployed', async () => {
    // arrange
    const reload = vi.fn()

    // act
    mountUpdateCheck({ fetchVersion: vi.fn().mockResolvedValue('newer'), reload, storage: createStorage() })

    // assert
    await vi.waitFor(() => expect(reload).toHaveBeenCalledOnce())
  })

  it('checks again when the app becomes visible', async () => {
    // arrange
    const fetchVersion = vi.fn().mockResolvedValue('current')
    mountUpdateCheck({ fetchVersion, reload: vi.fn(), storage: createStorage() })
    await vi.waitFor(() => expect(fetchVersion).toHaveBeenCalledOnce())
    fetchVersion.mockClear()

    // act
    visibilityState = 'hidden'
    document.dispatchEvent(new Event('visibilitychange'))
    visibilityState = 'visible'
    document.dispatchEvent(new Event('visibilitychange'))

    // assert
    await vi.waitFor(() => expect(fetchVersion).toHaveBeenCalledOnce())
  })

  it('does not check while the app is hidden', async () => {
    // arrange
    const fetchVersion = vi.fn().mockResolvedValue('current')
    mountUpdateCheck({ fetchVersion, reload: vi.fn(), storage: createStorage() })
    await vi.waitFor(() => expect(fetchVersion).toHaveBeenCalledOnce())
    fetchVersion.mockClear()

    // act
    visibilityState = 'hidden'
    document.dispatchEvent(new Event('visibilitychange'))

    // assert
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(fetchVersion).not.toHaveBeenCalled()
  })
})
