<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Card, Icon, icons } from '@/shared/ui'
import { isPaused, resumeTorrent, type Torrent } from '../model'
import {
  TorrentInfoCompleted,
  TorrentInfoDownloading,
  TorrentInfoError,
  TorrentInfoOther,
  TorrentInfoPaused,
  TorrentInfoQueued,
} from './torrent-info'

const props = defineProps<{ torrent: Torrent }>()

const QUEUE_STATES = new Set<Torrent['state']>(['downloading', 'stalledDL', 'pausedDL', 'queuedDL'])

const title = computed(() => {
  if (!QUEUE_STATES.has(props.torrent.state)) {
    return props.torrent.name
  }

  return `#${props.torrent.priority} ${props.torrent.name}`
})
</script>

<template>
  <RouterLink class="not-link" :to="`/torrent/${props.torrent.id}`">
    <Card>
      <div class="flex items-center gap-2">
        <div class="content flex flex-1 min-w-0 flex-col gap-2">
          <h3 class="break-words">{{ title }}</h3>

          <TorrentInfoCompleted v-if="props.torrent.progress >= 1" :torrent="props.torrent" />
          <TorrentInfoDownloading v-else-if="props.torrent.state === 'downloading'" :torrent="props.torrent" />
          <TorrentInfoPaused v-else-if="props.torrent.state === 'stoppedDL'" :torrent="props.torrent" />
          <TorrentInfoError v-else-if="props.torrent.state === 'missingFiles'" :torrent="props.torrent" />
          <TorrentInfoQueued v-else-if="props.torrent.state === 'queuedDL'" :torrent="props.torrent" />
          <TorrentInfoQueued v-else-if="props.torrent.state === 'stalledDL'" :torrent="props.torrent" />
          <TorrentInfoOther v-else :torrent="props.torrent" />
        </div>

        <button
          v-if="isPaused(props.torrent)"
          aria-label="Resume torrent"
          class="icon shrink-0 self-stretch -my-3 -mr-3 sm:-my-6 sm:-mr-4"
          title="Resume"
          @click.prevent.stop="resumeTorrent(props.torrent.id)"
        >
          <Icon :icon="icons.play" :size="24" />
        </button>
      </div>
    </Card>
  </RouterLink>
</template>

<style scoped>
h3 {
  font-size: 20px;
  font-weight: bold;
}

button {
  padding: 0.75rem;
}

@screen lt-sm {
  h3 {
    font-size: 14px;
  }

  button {
    padding: 0.5rem;
  }

  .content {
    font-size: 12px;
  }
}
</style>
