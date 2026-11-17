import { updateMainData } from '@/entities/torrents'
import type { MainData } from '@/shared/api'
import type { DeepPartial } from '@/shared/lib/types'

export const mockMainData = (data: DeepPartial<MainData>) => {
  updateMainData(data)
}
