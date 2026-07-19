<script setup lang="ts">
import { useRouter } from 'vue-router'
import Icon from './icon.vue'
import { icons } from './icons'

withDefaults(defineProps<{ parent?: string }>(), { parent: '/' })

const router = useRouter()

const goBack = () => {
  if (history.state.back) {
    router.back()
  } else if (parent) {
    router.replace(parent)
  }
}
</script>

<template>
  <div class="backdrop" @click="goBack" />

  <div class="modal">
    <div class="panel flex sm:flex-col gap-4 align-center">
      <button class="button p-5" title="Close" @click="goBack">
        <Icon :icon="icons.cross" />
      </button>

      <slot name="panel" />
    </div>

    <slot :go-back="goBack" />
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background-color: var(--black);
  opacity: 0.5;
}

.panel {
  background-color: var(--black);
  grid-area: panel;
}

button {
  background-color: var(--black);
  color: var(--secondary);
}
button:hover {
  color: var(--primary);
}

.modal {
  overflow: hidden;
  overscroll-behavior: contain;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(55rem, 100%);
  background-color: var(--background);
  box-shadow: -8px 0px 16px -4px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: 'panel .';
}

@screen lt-sm {
  .modal {
    grid-template-rows: 1fr auto;
    grid-template-columns: 1fr;
    grid-template-areas:
      '.'
      'panel';
  }
}
</style>
