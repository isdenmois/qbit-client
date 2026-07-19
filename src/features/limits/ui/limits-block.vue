<script setup lang="ts">
import { formatBytes } from 'shared/lib/format'
import { Icon } from 'shared/ui'

const props = defineProps<{ icon: string; limit: number }>()
const emit = defineEmits<{ limitChange: [limit: number] }>()

const limits = [1, 2, 3, 5, 8, 10, 15].map((limit) => limit * 1024 * 1024)
</script>

<template>
  <div class="flex gap-2">
    <Icon :icon="props.icon" />
    <h1>{{ formatBytes(props.limit) }}</h1>
  </div>

  <div class="mt-2 flex flex-wrap gap-2">
    <button
      v-for="limitMb in limits"
      :key="limitMb"
      :class="{ secondary: props.limit !== limitMb }"
      @click="emit('limitChange', limitMb)"
    >
      {{ formatBytes(limitMb) }}
    </button>
  </div>
</template>
