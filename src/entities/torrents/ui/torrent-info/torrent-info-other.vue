<script setup lang="ts">
import { formatBytes, formatNumber } from '@/shared/lib/format'
import { Icon, icons } from '@/shared/ui'
import { type Torrent } from '../../model'

const props = defineProps<{ torrent: Torrent }>()
</script>

<template>
  <div class="flex items-center gap-4 md:gap-8">
    <p class="flex items-center gap-2">
      <span class="color-secondary"><Icon :icon="icons.save" :size="24" /></span>
      {{ formatBytes(props.torrent.size) }}
    </p>

    <p class="flex-1 text-end self-end color-secondary">{{ formatNumber(props.torrent.progress * 100) }}%</p>

    <p>STATE: {{ props.torrent.state }}</p>
  </div>
</template>
