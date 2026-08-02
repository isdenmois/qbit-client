<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Card } from '@/shared/ui'
import { type Torrent } from '../model'
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
      <div class="content flex flex-col gap-2">
        <h3 class="break-words">{{ title }}</h3>

        <TorrentInfoCompleted v-if="props.torrent.progress >= 1" :torrent="props.torrent" />
        <TorrentInfoDownloading v-else-if="props.torrent.state === 'downloading'" :torrent="props.torrent" />
        <TorrentInfoPaused v-else-if="props.torrent.state === 'stoppedDL'" :torrent="props.torrent" />
        <TorrentInfoError v-else-if="props.torrent.state === 'missingFiles'" :torrent="props.torrent" />
        <TorrentInfoQueued v-else-if="props.torrent.state === 'queuedDL'" :torrent="props.torrent" />
        <TorrentInfoOther v-else :torrent="props.torrent" />
      </div>
    </Card>
  </RouterLink>
</template>

<style scoped>
h3 {
  font-size: 20px;
  font-weight: bold;
}

@screen lt-sm {
  h3 {
    font-size: 14px;
  }

  .content {
    font-size: 12px;
  }
}
</style>
