<script setup lang="ts">
import { maindata } from '@/entities/stats'
import { icons } from '@/shared/ui'
import { setUploadLimit } from '../model'
import LimitsBlock from './limits-block.vue'
</script>

<template>
  <LimitsBlock
    :icon="icons.arrowUp"
    :limit="maindata?.server_state.up_rate_limit ?? 0"
    @limit-change="setUploadLimit"
  />
</template>
