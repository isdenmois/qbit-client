<script setup lang="ts">
import { useToasts } from './toasts'

const toasts = useToasts()
</script>

<template>
  <Teleport to="body">
    <div class="toast-host">
      <TransitionGroup name="toast">
        <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.type" role="status">
          {{ toast.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-host {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: min(24rem, calc(100vw - 2rem));
}

.toast {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: var(--background);
  background-color: var(--primary);
}

.toast.error {
  background-color: var(--error);
  color: var(--primary);
}

.toast.success {
  background-color: var(--success);
  color: var(--black);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}

@screen lt-sm {
  .toast-host {
    left: 1rem;
    right: 1rem;
    top: auto;
    bottom: 5rem;
    max-width: none;
  }
}
</style>
