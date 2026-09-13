<script setup lang="ts">
import { inject, onMounted, onUnmounted } from 'vue'
import { MainDataPollerKey } from '@/entities/stats'
import NavBar from './navbar.vue'

const poller = inject(MainDataPollerKey)

onMounted(() => {
  poller?.start()
})

onUnmounted(() => {
  poller?.stop
})
</script>

<template>
  <div class="root">
    <NavBar />

    <main class="main">
      <div class="content">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.root {
  display: flex;
  flex: 1;
  background-color: var(--black);
  justify-content: center;
}

.main {
  margin: 1.5rem 1.5rem 1.5rem 0;
  flex: 1;
  background-color: var(--background);
  border-radius: 2rem;
  padding: 2rem;
  height: calc(100vh - 9rem);
  display: flex;
  max-width: 80rem;
}

.content {
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
}

/* Mobile */
@screen lt-sm {
  .root {
    flex-direction: column;
    max-height: 100dvh;
  }

  .root > .main {
    margin: 0;
    border-radius: 0;
    padding: 0;
  }

  .root > .main > .content {
    padding-bottom: 5rem;
  }
}
</style>
