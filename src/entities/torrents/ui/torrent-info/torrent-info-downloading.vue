<script setup lang="ts">
import { formatBytes, formatEta, formatNumber } from 'shared/lib/format'
import { isEtaVisible } from 'shared/lib/utils'
import { Icon, icons, Progress } from 'shared/ui'
import { type Torrent } from '../../model'

const props = defineProps<{ torrent: Torrent }>()
</script>

<template>
  <div class="flex items-center gap-4 md:gap-8">
    <p class="flex items-center gap-2">
      <span class="color-secondary"><Icon :icon="icons.save" :size="24" /></span>
      {{ formatBytes(props.torrent.size) }}
    </p>

    <p v-if="props.torrent.dlspeed" class="flex items-center gap-2">
      <span class="color-secondary"><Icon :icon="icons.arrowDown" :size="24" /></span>
      {{ formatBytes(props.torrent.dlspeed) }}
    </p>

    <p v-if="props.torrent.num_seeds" class="flex items-center gap-2 hidden-s">
      <span class="color-secondary"><Icon :icon="icons.user" :size="24" /></span>
      {{ props.torrent.num_seeds }}
    </p>

    <p v-if="isEtaVisible(props.torrent.eta)" class="flex items-center gap-2">
      <span class="color-secondary"><Icon :icon="icons.clock" :size="24" /></span>
      {{ formatEta(props.torrent.eta) }}
    </p>

    <p class="flex-1 text-end self-end color-secondary">{{ formatNumber(props.torrent.progress * 100) }}%</p>
  </div>

  <Progress :value="props.torrent.progress" />
</template>
