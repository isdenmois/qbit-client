<script setup lang="ts">
import { preferences } from '@/entities/preferences'
import { setMaxActiveDownloads } from '../model'
import LimitsBlock from './limits-block.vue'
</script>

<template>
  <div>
    <p class="mb-2 uppercase tracking-wider text-xs">Max active downloads</p>
    <LimitsBlock
      :limit="preferences?.max_active_downloads ?? 0"
      :options="[1, 2, 3, 4]"
      :format="String"
      @limit-change="setMaxActiveDownloads"
    />
  </div>
</template>
