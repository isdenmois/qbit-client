<script setup lang="ts">
import { formatBytes } from '@/shared/lib/format'
import { Icon } from '@/shared/ui'

const props = withDefaults(
  defineProps<{ icon?: string; limit: number; options?: number[]; format?: (value: number) => string }>(),
  {
    options: () => [1, 2, 3, 5, 8, 10, 15].map((limit) => limit * 1024 * 1024),
    format: (value: number) => formatBytes(value),
  },
)
const emit = defineEmits<{ limitChange: [limit: number] }>()
</script>

<template>
  <div v-if="icon" class="flex gap-2">
    <Icon :icon="icon" />
    <h1>{{ props.format(props.limit) }}</h1>
  </div>

  <div class="mt-2 flex flex-wrap gap-2">
    <button
      v-for="option in props.options"
      :key="option"
      :class="{ secondary: props.limit !== option }"
      @click="emit('limitChange', option)"
    >
      {{ props.format(option) }}
    </button>
  </div>
</template>
