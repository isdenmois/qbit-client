import { computed } from 'vue'
import type { Category } from '@/shared/api'
import { maindata } from './maindata'

export const categories = computed<Category[]>(() => Object.values(maindata.value?.categories ?? {}))

export const removeCategoryLocally = (name: string) => {
  if (maindata.value?.categories) {
    delete maindata.value.categories[name]
  }
}
