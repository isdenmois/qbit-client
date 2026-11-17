<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { loadPreferences, preferences } from '@/entities/preferences'
import {
  completedTorrents,
  downloadingTorrents,
  LimitsCard,
  otherTorrents,
  pausedTorrents,
  queuedTorrents,
  SpaceCard,
  SpeedCard,
  StatsCard,
  TorrentItem,
} from '@/entities/torrents'
import { Icon, icons } from '@/shared/ui'
import {
  completedCategories,
  completedFiltered,
  cycleRatioFilter,
  filters,
  ratioFilterActive,
  ratioFilterLabel,
  toggleCategoryFilter,
  toggleUploadingFilter,
} from '../model'
import NameFilter from './name-filter.vue'

// The ratio filter reads the seed limit from preferences; fetch them once per session.
onMounted(() => {
  if (!preferences.value) {
    loadPreferences()
  }
})
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

    <NameFilter class="mt-4">
      <h1 v-if="completedFiltered.length !== completedTorrents.length">
        Completed ({{ completedFiltered.length }}
        / {{ completedTorrents.length }})
      </h1>
      <h1 v-else>Completed ({{ completedTorrents.length }})</h1>
    </NameFilter>

    <div class="flex flex-wrap gap-2">
      <button class="secondary" :class="{ selected: ratioFilterActive }" @click="cycleRatioFilter">
        {{ ratioFilterLabel }}
      </button>
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

  <div class="add shadow-panel">
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
  bottom: calc(5rem + var(--safe-bottom));
  height: 4rem;
  width: 4rem;
  background-color: var(--add);
  color: var(--background);
  border-radius: 50%;
}

@screen lt-sm {
  .stats-row {
    grid-gap: 1rem;
    grid-template-columns: repeat(auto-fill, calc(50vw - 1.5rem));
  }
}
</style>
