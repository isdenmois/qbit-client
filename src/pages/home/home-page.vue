<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { LimitsCard, SpaceCard, SpeedCard, StatsCard } from '@/entities/stats'
import {
  completedCategories,
  completedFiltered,
  completedTorrents,
  downloadingTorrents,
  filters,
  otherTorrents,
  pausedTorrents,
  query,
  queuedTorrents,
  TorrentItem,
  toggleCategoryFilter,
  toggleUploadedFilter,
  toggleUploadingFilter,
} from '@/entities/torrents'
import { focusOnMount } from '@/shared/lib/utils'
import { Icon, icons } from '@/shared/ui'

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
  <div class="stats-row">
    <SpeedCard />
    <LimitsCard />
    <StatsCard />
    <SpaceCard />
  </div>

  <div class="flex flex-col gap-4">
    <h1 v-if="downloadingTorrents.length > 0" class="mt-4">Active ({{ downloadingTorrents.length }})</h1>

    <TorrentItem v-for="torrent in downloadingTorrents" :key="torrent.id" :torrent="torrent" />

    <h1 v-if="queuedTorrents.length > 0" class="mt-4">Queued ({{ queuedTorrents.length }})</h1>

    <TorrentItem v-for="torrent in queuedTorrents" :key="torrent.id" :torrent="torrent" />

    <h1 v-if="pausedTorrents.length > 0" class="mt-4">Paused ({{ pausedTorrents.length }})</h1>

    <TorrentItem v-for="torrent in pausedTorrents" :key="torrent.id" :torrent="torrent" />

    <div class="title-row mt-4">
      <div class="title">
        <h1 v-if="completedFiltered.length !== completedTorrents.length">
          Completed ({{ completedFiltered.length }}
          / {{ completedTorrents.length }})
        </h1>
        <h1 v-else>Completed ({{ completedTorrents.length }})</h1>

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
        <Icon :icon="icons.search" />
      </button>
    </div>

    <div class="flex flex-wrap gap-2">
      <button class="secondary" :class="{ selected: filters.uploaded }" @click="toggleUploadedFilter">Ratio > 1</button>
      <button class="secondary" :class="{ selected: filters.uploading }" @click="toggleUploadingFilter">
        Uploading
      </button>

      <button
        v-for="cat in completedCategories"
        :key="cat"
        class="secondary"
        :class="{ selected: filters.category === cat }"
        @click="() => toggleCategoryFilter(cat)"
      >
        {{ cat }}
      </button>
    </div>

    <TorrentItem v-for="torrent in completedFiltered" :key="torrent.id" :torrent="torrent" />

    <h1 v-if="otherTorrents.length > 0" class="mt-4">Other ({{ otherTorrents.length }})</h1>

    <TorrentItem v-for="torrent in otherTorrents" :key="torrent.id" :torrent="torrent" />
  </div>

  <div class="add">
    <RouterLink class="flex h-full items-center justify-center not-link" to="/add">
      <Icon :icon="icons.plus" />
    </RouterLink>
  </div>

  <RouterView />
</template>

<style scoped>
.stats-row {
  display: grid;
  grid-gap: 2.5rem;
  grid-template-columns: repeat(auto-fill, 15rem);
}

.add {
  position: absolute;
  right: 1rem;
  bottom: 5rem;
  height: 4rem;
  width: 4rem;
  background-color: var(--add);
  color: var(--background);
  border-radius: 50%;
  box-shadow: -8px 0px 16px -4px rgba(0, 0, 0, 0.1);
}

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

@screen lt-sm {
  .stats-row {
    grid-gap: 1rem;
    grid-template-columns: repeat(auto-fill, calc(50vw - 1.5rem));
  }
}
</style>
