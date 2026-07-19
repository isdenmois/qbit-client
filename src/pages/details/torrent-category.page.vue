<script setup lang="ts">
import { maindata } from 'entities/stats'
import { categories } from 'entities/torrents'
import { api } from 'shared/api'
import { ModalContent } from 'shared/ui'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id as string

const torrent = computed(() => (maindata.value ? maindata.value.torrents[id] : undefined))
const selectedCategory = ref(torrent.value?.category || null)

const change = (categoryId: string) => {
  api.torrent.setCategory(id, categoryId)
  selectedCategory.value = categoryId
}
</script>

<template>
  <ModalContent :title="torrent?.name || ''">
    <ul>
      <li v-for="category in categories" :key="category.id" class="mb-2">
        <button :class="{ secondary: category.id !== selectedCategory }" @click="change(category.id)">
          {{ category.id }}
        </button>
      </li>
    </ul>
  </ModalContent>
</template>
