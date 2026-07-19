import { updateMainData } from 'entities/stats'
import type { MainData } from 'shared/api/sync'
import type { DeepPartial } from 'shared/lib/types'

export const mockMainData = (data: DeepPartial<MainData>) => {
  updateMainData(data)
}
