<script setup lang="ts">
import { maindata } from '@/entities/stats'
import { icons } from '@/shared/ui'
import { setDownloadLimit } from '../model'
import LimitsBlock from './limits-block.vue'
</script>

<template>
  <LimitsBlock
    :icon="icons.arrowDown"
    :limit="maindata?.server_state.dl_rate_limit ?? 0"
    @limit-change="setDownloadLimit"
  />
</template>
