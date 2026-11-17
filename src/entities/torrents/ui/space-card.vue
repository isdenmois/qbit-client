<script setup lang="ts">
import { maindata } from '../model'
import StatCard from './stat-card.vue'
</script>

<template>
  <StatCard v-if="maindata" title="Free Space" :down="maindata.server_state.free_space_on_disk" />
</template>
