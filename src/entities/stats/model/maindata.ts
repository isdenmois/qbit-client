import { atom, onMount } from 'nanostores'
import { merge } from 'lodash-es'
import { api } from 'shared/api'
import type { MainData } from 'shared/api/sync'

export const maindata = atom<MainData | null>(null)

onMount(maindata, () => {
  let timeout: NodeJS.Timeout
  let rid: number = 0

  const load = async () => {
    try {
      const data = await api.sync.maindata(rid)
      rid = data.rid
      maindata.set(merge(structuredClone(maindata.get() ?? {}), data))
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
