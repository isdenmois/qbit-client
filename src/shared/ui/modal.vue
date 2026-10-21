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
  <div class="dialog-backdrop dialog-backdrop--soft" @click="goBack" />

  <div class="modal shadow-panel">
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
.panel {
  background-color: var(--black);
  grid-area: panel;
}

button {
  background-color: var(--black);
  color: var(--secondary);
}
@media (hover: hover) {
  button:hover {
    color: var(--primary);
  }
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

  .panel {
    padding-bottom: var(--safe-bottom);
  }
}
</style>
