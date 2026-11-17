<script setup lang="ts">
import { preferences } from '@/entities/preferences'
import { setMaxRatio } from '../model'
import LimitsBlock from './limits-block.vue'
</script>

<template>
  <div>
    <p class="mb-2 uppercase tracking-wider text-xs">Max ratio</p>
    <LimitsBlock
      :limit="preferences?.max_ratio ?? 0"
      :options="[1, 2, 3, 4, 5]"
      :format="String"
      @limit-change="setMaxRatio"
    />
  </div>
</template>
