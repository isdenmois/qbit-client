<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div class="wrapper flex items-center">
    <div class="title w-60">{{ title }}</div>
    <div class="value">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.title {
  color: var(--secondary);
}

@screen lt-sm {
  .wrapper {
    flex-direction: column;
    align-items: start;
    gap: 0.25rem;
  }

  .title {
    font-size: 14px;
  }
}
</style>
