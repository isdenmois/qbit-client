<script setup lang="ts">
import { Card } from 'shared/ui'
import { RouterLink } from 'vue-router'
import { type Torrent } from '../model'
import {
  TorrentInfoCompleted,
  TorrentInfoDownloading,
  TorrentInfoError,
  TorrentInfoOther,
  TorrentInfoPaused,
} from './torrent-info'

const props = defineProps<{ torrent: Torrent }>()
</script>

<template>
  <RouterLink class="not-link" :to="`/torrent/${props.torrent.id}`">
    <Card>
      <div class="content flex flex-col gap-2">
        <h3 class="break-words">{{ props.torrent.name }}</h3>

        <TorrentInfoCompleted v-if="props.torrent.progress >= 1" :torrent="props.torrent" />
        <TorrentInfoDownloading v-else-if="props.torrent.state === 'downloading'" :torrent="props.torrent" />
        <TorrentInfoPaused v-else-if="props.torrent.state === 'pausedDL'" :torrent="props.torrent" />
        <TorrentInfoError v-else-if="props.torrent.state === 'missingFiles'" :torrent="props.torrent" />
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
