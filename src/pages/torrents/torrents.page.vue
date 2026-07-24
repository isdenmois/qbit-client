<script setup lang="ts">
import { categories, category, selectCategory, TorrentItem, torrentsFiltered } from 'entities/torrents'
</script>

<template>
  <h1>Torrents ({{ torrentsFiltered.length }})</h1>

  <div class="mt-4 flex flex-wrap gap-2">
    <button
      v-for="cat in categories"
      :key="cat.id"
      class="secondary"
      :class="{ selected: category === cat.id }"
      @click="selectCategory(cat.id)"
    >
      {{ cat.name }}
    </button>
  </div>

  <div class="mt-4 flex flex-col gap-4">
    <TorrentItem v-for="torrent in torrentsFiltered" :key="torrent.id" :torrent="torrent" />
  </div>
</template>
