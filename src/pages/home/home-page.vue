<script setup lang="ts">
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
  queuedTorrents,
  TorrentItem,
  toggleCategoryFilter,
  toggleUploadedFilter,
  toggleUploadingFilter,
} from '@/entities/torrents'
import { Icon, icons } from '@/shared/ui'
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

    <h1 v-if="completedFiltered.length !== completedTorrents.length" class="mt-4">
      Completed ({{ completedFiltered.length }}
      / {{ completedTorrents.length }})
    </h1>
    <h1 v-else class="mt-4">Completed ({{ completedTorrents.length }})</h1>

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

@screen lt-sm {
  .stats-row {
    grid-gap: 1rem;
    grid-template-columns: repeat(auto-fill, calc(50vw - 1.5rem));
  }
}
</style>
