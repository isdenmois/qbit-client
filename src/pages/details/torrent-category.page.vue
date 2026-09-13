<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { useRoute } from 'vue-router'
import { MainDataPollerKey, maindata } from '@/entities/stats'
import { categories } from '@/entities/torrents'
import { api } from '@/shared/api'
import { ModalContent } from '@/shared/ui'

const route = useRoute()
const id = route.params.id as string

const poller = inject(MainDataPollerKey)

const torrent = computed(() => (maindata.value ? maindata.value.torrents[id] : undefined))
const selectedCategory = ref(torrent.value?.category || null)

const change = async (categoryName: string) => {
  await api.torrent.setCategory(id, categoryName)
  selectedCategory.value = categoryName
  poller?.refresh()
}
</script>

<template>
  <ModalContent :title="torrent?.name || ''">
    <ul>
      <li v-for="category in categories" :key="category.name" class="mb-2">
        <button :class="{ secondary: category.name !== selectedCategory }" @click="change(category.name)">
          {{ category.name }}
        </button>
      </li>
    </ul>
  </ModalContent>
</template>
