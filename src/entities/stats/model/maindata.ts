import { atom, onMount } from 'nanostores'
import { merge } from 'lodash-es'
import { api } from 'shared/api'
import type { MainData } from 'shared/api/sync'
import type { DeepPartial } from 'shared/lib/types'

export const maindata = atom<MainData | null>(null)

export const updateMainData = (data: DeepPartial<MainData>) => {
  maindata.set(merge(structuredClone(maindata.get() ?? {}), data) as MainData)
}

onMount(maindata, () => {
  let timeout: NodeJS.Timeout
  let rid: number = 0

  const load = async () => {
    try {
      const data = await api.sync.maindata(rid)
      rid = data.rid

      updateMainData(data)
    } catch (error) {
      console.log(`Error loading`, error)
    }

    timeout = setTimeout(load, 2000)
  }

  load()

  return () => {
    // destroy
    clearTimeout(timeout)
  }
})
