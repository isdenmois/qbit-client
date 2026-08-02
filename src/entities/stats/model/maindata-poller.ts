import { computed, type InjectionKey, type Ref, ref, watch } from 'vue'
import { api } from '@/shared/api'
import { isLoggedIn } from '@/shared/api/auth-state'
import { updateMainData } from './maindata'

export interface MainDataPoller {
  start: () => void
  stop: () => void
  refresh: () => void
  isPolling: Readonly<Ref<boolean>>
}

export const MainDataPollerKey: InjectionKey<MainDataPoller> = Symbol('mainDataPoller')

export const createMainDataPoller = (): MainDataPoller & { destroy: () => void } => {
  const TIMEOUT = 2000
  const MAX_TIMEOUT = 60_000
  const BACKOFF_MULTIPLIER = 2

  let rid = 0
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let delay = TIMEOUT
  const polling = ref(false)

  const stopAuthWatcher = watch(isLoggedIn, (loggedIn) => {
    if (!loggedIn) {
      stop()
    }
  })

  const load = async () => {
    if (!isLoggedIn.value) {
      stop()
      return
    }

    try {
      const data = await api.sync.maindata(rid)
      rid = data.rid
      updateMainData(data)
      delay = TIMEOUT
    } catch (error) {
      console.error('Error loading maindata', error)
      delay = Math.min(delay * BACKOFF_MULTIPLIER, MAX_TIMEOUT)
    }

    if (polling.value) {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(load, delay)
    }
  }

  const start = () => {
    if (polling.value) return
    polling.value = true
    delay = TIMEOUT
    load()
  }

  const stop = () => {
    polling.value = false
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = undefined
    }
  }

  const destroy = () => {
    stop()
    stopAuthWatcher()
  }

  return {
    start,
    stop,
    refresh: load,
    isPolling: computed(() => polling.value),
    destroy,
  }
}
