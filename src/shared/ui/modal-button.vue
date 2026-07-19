<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Icon from './icon.vue'

defineProps<{ icon: string; title: string; to: string }>()
</script>

<template>
  <RouterLink class="nav-link not-link flex flex-col items-center justify-center" :to="to" :replace="true">
    <Icon :icon="icon" />
    <div>{{ title }}</div>
  </RouterLink>
</template>
