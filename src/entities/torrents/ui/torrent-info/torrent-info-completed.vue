<script setup lang="ts">
import { formatBytes, formatNumber } from 'shared/lib/format'
import { Icon, icons } from 'shared/ui'
import { type Torrent } from '../../model'

const props = defineProps<{ torrent: Torrent }>()
</script>

<template>
  <div class="flex items-center gap-4 md:gap-8">
    <p class="flex items-center gap-2">
      <span class="color-secondary"><Icon :icon="icons.save" :size="24" /></span>
      {{ formatBytes(props.torrent.size) }}
    </p>

    <p v-if="props.torrent.ratio > 1" class="flex items-center gap-2">
      <span class="color-secondary"><Icon :icon="icons.offer" :size="24" /></span>
      {{ formatNumber(props.torrent.ratio) }}
    </p>

    <p v-if="props.torrent.upspeed" class="flex items-center gap-2">
      <span class="color-secondary"><Icon :icon="icons.arrowUpCircle" :size="24" /></span>
      {{ formatBytes(props.torrent.upspeed) }}
    </p>
  </div>
</template>
