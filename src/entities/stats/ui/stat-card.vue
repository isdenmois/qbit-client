<script setup lang="ts">
import { formatBytes } from '@/shared/lib/format'
import { Card, Icon, icons } from '@/shared/ui'

withDefaults(defineProps<{ title: string; down: number; up?: number }>(), { up: 0 })
</script>

<template>
  <Card :title="title">
    <div class="row mt-4">
      <Icon :icon="icons.arrowDown" />

      <div>{{ formatBytes(down) }}</div>
    </div>

    <div v-if="up" class="row mt-2">
      <Icon :icon="icons.arrowUpCircle" />
      <div>{{ formatBytes(up) }}</div>
    </div>
  </Card>
</template>

<style scoped>
.row {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  font-size: 32px;
  font-weight: bold;
}

@screen lt-sm {
  .row {
    font-size: 22px;
  }
}
</style>
