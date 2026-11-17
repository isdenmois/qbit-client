<script setup lang="ts">
import { ref } from 'vue'
import { focusOnMount } from '@/shared/lib/utils'
import { Icon, icons } from '@/shared/ui'
import { query } from '../model'

const searchOpen = ref(false)

const closeSearch = () => {
  searchOpen.value = false
  query.value = ''
}

const toggleSearch = () => {
  if (searchOpen.value) {
    closeSearch()
  } else {
    searchOpen.value = true
  }
}
</script>

<template>
  <div class="title-row">
    <div class="title">
      <slot />

      <input
        v-if="searchOpen"
        v-model="query"
        :ref="focusOnMount"
        aria-label="Filter completed torrents by name"
        placeholder="Filter by name"
        type="text"
        @keydown.esc="closeSearch"
      >
    </div>

    <button aria-label="Search completed torrents" title="Search completed torrents" @click="toggleSearch">
      <Icon :icon="searchOpen ? icons.cross : icons.search" />
    </button>
  </div>
</template>

<style scoped>
.title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title {
  position: relative;
  flex: 1;
  min-width: 0;
}

.title input {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
  box-sizing: border-box;
  background-color: var(--background);
}

.title-row button {
  padding: 0.5rem 0.75rem;
  background-color: transparent;
  color: var(--secondary);
}
</style>
