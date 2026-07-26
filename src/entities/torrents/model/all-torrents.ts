import { computed, ref } from 'vue'
import { compare } from '@/shared/lib/utils'
import { type Torrent, torrents } from './torrents'

export const category = ref('')
export const order = ref<keyof Torrent>('added_on')

export const selectCategory = (cat: string) => {
  if (category.value === cat) {
    category.value = ''
  } else {
    category.value = cat
  }
}

export const torrentsFiltered = computed(() => {
  const byCategory = category.value
    ? torrents.value.filter((torrent) => torrent.category === category.value)
    : [...torrents.value]

  return byCategory.sort(compare((torrent) => -torrent[order.value]))
})
