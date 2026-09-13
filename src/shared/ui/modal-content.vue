<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div class="flex flex-col w-full h-full overflow-hidden">
    <header class="flex items-center gap-2 px-4 md:px-8 py-6 break-words">
      <h2 class="flex-1">{{ title }}</h2>

      <slot name="actions" />
    </header>

    <div class="flex-1 px-4 md:px-8 py-6 overflow-y-auto">
      <slot />
    </div>

    <slot name="bottom" />
  </div>
</template>

<style scoped>
header {
  border-bottom: 1px solid var(--card);
}

h2 {
  color: var(--secondary);
  font-size: 14px;
  font-weight: bold;
}
</style>
