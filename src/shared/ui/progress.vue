<script setup lang="ts">
withDefaults(defineProps<{ value: number; secondary?: boolean }>(), { secondary: false })
</script>

<template>
  <progress class="block w-a" :class="{ secondary }" max="1" :value="value" />
</template>

<style scoped>
progress {
  appearance: none;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}

progress::-webkit-progress-bar {
  background-color: var(--progress-background);
}

progress::-webkit-progress-value {
  background-color: var(--success);
}

progress.secondary::-webkit-progress-value {
  background-color: var(--secondary);
}

@screen lt-sm {
  progress {
    height: 6px;
    border-radius: 3px;
  }
}
</style>
