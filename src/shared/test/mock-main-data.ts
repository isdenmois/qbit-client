import { mockGet } from 'vi-fetch'
import type { MainData } from 'shared/api/sync'
import type { DeepPartial } from 'shared/lib/types'
import { updateMainData } from 'entities/stats'

export const mockMainData = (data: DeepPartial<MainData>) => {
  mockGet('/api/v2/sync/maindata?rid=0').willResolve({
    rid: 0,
  })

  updateMainData(data)
}
