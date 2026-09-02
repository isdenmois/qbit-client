<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { api } from '@/shared/api'
</script>

<template>
  <div>
    <RouterLink class="not-link" to="/settings/categories">
      <button>Manage Categories</button>
    </RouterLink>
  </div>

  <button class="mt-4" @click="api.auth.logout">Logout</button>

  <RouterView />
</template>

<style scoped>
.entry {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 1rem 2rem;
  background-color: var(--success);
  color: var(--background);
  font-size: 16px;
  cursor: pointer;
  width: fit-content;
}

.entry:hover {
  opacity: 0.9;
}
</style>
