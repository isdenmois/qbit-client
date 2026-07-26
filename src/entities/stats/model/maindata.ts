import merge from 'merge'
import { ref } from 'vue'
import type { MainData } from '@/shared/api/sync'
import type { DeepPartial } from '@/shared/lib/types'

export const maindata = ref<MainData | null>(null)

export const updateMainData = (data: DeepPartial<MainData>) => {
  maindata.value = merge.recursive(false, maindata.value ?? {}, data)
}
