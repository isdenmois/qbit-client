<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <div class="card">
    <h2 v-if="title" class="truncate">{{ title }}</h2>
    <slot />
  </div>
</template>

<style scoped>
.card {
  background-color: var(--card);
  border-radius: 0.75rem;
  padding: 1rem;
}

h2 {
  font-size: 16px;
  font-weight: bold;
  color: var(--secondary);
}

@screen lt-sm {
  .card {
    padding: 0.75rem;
    border-radius: 0.5rem;
  }
}
</style>
