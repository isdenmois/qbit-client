<script setup lang="ts">
import { formatBytes, formatNumber } from '@/shared/lib/format'
import { Icon, icons, Progress } from '@/shared/ui'
import { type Torrent } from '../../model'

defineProps<{ torrent: Torrent }>()
</script>

<template>
  <div class="flex items-center gap-4 md:gap-8">
    <p class="flex items-center gap-2">
      <span class="color-secondary"><Icon :icon="icons.save" :size="24" /></span>
      {{ formatBytes(torrent.size) }}
    </p>

    <p v-if="torrent.progress >= 0.0001" class="flex-1 text-end self-end color-secondary">
      {{ formatNumber(torrent.progress * 100) }}%
    </p>
  </div>
</template>
