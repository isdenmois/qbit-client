<script setup lang="ts">
withDefaults(defineProps<{ icon: string; size?: number }>(), { size: 32 })
</script>

<template>
  <svg :height="size" :width="size">
    <use :xlink:href="`${icon}#icon`"></use>
  </svg>
</template>

<style scoped>
svg {
  flex-shrink: 0;
}
</style>
