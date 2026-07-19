import merge from 'merge'
import { api } from 'shared/api'
import type { MainData } from 'shared/api/sync'
import type { DeepPartial } from 'shared/lib/types'
import { ref } from 'vue'

export const maindata = ref<MainData | null>(null)

export const updateMainData = (data: DeepPartial<MainData>) => {
  maindata.value = merge.recursive(false, maindata.value ?? {}, data)
}

const TIMEOUT = 2000

let rid = 0
let timeoutId: ReturnType<typeof setTimeout> | undefined
let polling = false

export const startPolling = () => {
  if (polling) return
  polling = true

  const load = async () => {
    try {
      const data = await api.sync.maindata(rid)
      rid = data.rid
      updateMainData(data)
    } catch (error) {
      console.log('Error loading', error)
    }

    if (polling) {
      timeoutId = setTimeout(load, TIMEOUT)
    }
  }

  load()
}

export const stopPolling = () => {
  polling = false
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = undefined
  }
}
