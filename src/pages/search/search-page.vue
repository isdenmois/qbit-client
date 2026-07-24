<script setup lang="ts">
import { setPendingFile } from 'pages/add/pending-file'
import { api } from 'shared/api'
import type { SearchResult } from 'shared/api/jk'
import { downloadTorrent } from 'shared/api/jk'
import { compare } from 'shared/lib/utils'
import { Icon, icons, Loading } from 'shared/ui'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const downloadingGuid = ref<string | null>(null)

const downloadToAdd = async (item: SearchResult) => {
  if (downloadingGuid.value) return
  downloadingGuid.value = item.Guid
  try {
    const file = await downloadTorrent(item.Link, `${item.Title}.torrent`)
    setPendingFile(file)
    router.push('/add')
  } catch (error) {
    alert(`Download failed: ${error}`)
  } finally {
    downloadingGuid.value = null
  }
}

const urlParams = new URLSearchParams(window.location.search)
const q = urlParams.get('q') || null
const query = ref(q || '')
const loading = ref(false)
const results = ref<SearchResult[]>([])
const found = computed(() => results.value.length)
const sortBy = ref('seeders')

const items = computed(() =>
  sortBy.value === 'date' ? results.value : results.value.toSorted(compare((item) => item.Seeders)).reverse(),
)

onMounted(() => {
  if (q) {
    search()
  }
})

const reset = () => {
  results.value = []
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru')
}

const search = async () => {
  loading.value = true
  reset()

  try {
    const { Results } = await api.jk.search(query.value)

    results.value = Results
  } finally {
    loading.value = false
  }
}

const orders = [
  { id: 'seeders', label: 'Seeders' },
  { id: 'date', label: 'Date' },
]

const inputRef = ref<HTMLInputElement | null>(null)
onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <form class="flex" @submit.prevent="search">
    <input
      ref="inputRef"
      v-model="query"
      class="flex-1"
      placeholder="Query"
      type="text"
      :disabled="loading"
      @input="reset"
    >
  </form>

  <div class="mt-2 flex gap-2">
    <button
      v-for="order in orders"
      :key="order.id"
      :class="{ secondary: sortBy !== order.id }"
      @click="sortBy = order.id"
    >
      {{ order.label }}
    </button>
  </div>

  <h3 v-if="found > 0" class="mt-4">Found {{ found }}</h3>

  <div v-if="loading" class="flex place-content-center">
    <Loading />
  </div>

  <ul>
    <li v-for="item in items" :key="item.Guid" class="mt-4 flex gap-1">
      <a class="flex flex-col not-link" :href="item.Details" target="_blank">
        <div class="shrink-0 min-w-16 description">
          {{ formatDate(item.PublishDate) }}
          {{ item.Tracker }}
          ({{ item.Seeders }}
          / {{ item.Peers }})
        </div>

        <div>
          {{ item.Title }}
        </div>
      </a>

      <a class="not-link" :href="item.Link" target="_blank" @contextmenu.prevent="downloadToAdd(item)">
        <Loading v-if="downloadingGuid === item.Guid" />
        <Icon v-else :icon="icons.download" />
      </a>
    </li>
  </ul>
</template>

<style scoped>
.description {
  font-size: 12px;
}
</style>
