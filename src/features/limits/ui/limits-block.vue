<script setup lang="ts">
import { formatBytes } from '@/shared/lib/format'
import { Icon } from '@/shared/ui'

interface Props {
  icon?: string
  limit: number
  description?: string
  options?: number[]
  format?: (value: number) => string
}

interface Emits {
  limitChange: [limit: number]
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [1, 2, 3, 5, 8, 10, 15].map((limit) => limit * 1024 * 1024),
  format: formatBytes,
})

const emit = defineEmits<Emits>()
</script>

<template>
  <p class="flex flex-wrap gap-2 items-center text-xs" v-if="description">
    <Icon v-if="icon" :icon="icon" :size="24" />
    <span class="uppercase">{{ description }} </span>
    <span v-if="!options.includes(limit)">({{ format(limit) }})</span>
  </p>

  <div v-else-if="icon" class="flex gap-2 items-center">
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
