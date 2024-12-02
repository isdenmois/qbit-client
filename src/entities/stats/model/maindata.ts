import { atom, onMount } from 'nanostores'
import merge from 'merge'
import { api } from 'shared/api'
import type { MainData } from 'shared/api/sync'
import type { DeepPartial } from 'shared/lib/types'

export const maindata = atom<MainData | null>(null)

export const updateMainData = (data: DeepPartial<MainData>) => {
  maindata.set(merge.recursive(false, maindata.get(), data))
}

const TIMEOUT = 2000

onMount(maindata, () => {
  let rid: number = 0
  let timeoutId: NodeJS.Timeout | undefined

  const load = async () => {
    try {
      const data = await api.sync.maindata(rid)
      rid = data.rid

      updateMainData(data)
    } catch (error) {
      console.log(`Error loading`, error)
    }

    timeoutId = setTimeout(load, TIMEOUT)
  }

  load()

  return () => {
    // destroy
    clearTimeout(timeoutId)
  }
})
