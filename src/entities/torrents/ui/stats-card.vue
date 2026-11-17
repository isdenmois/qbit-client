<script setup lang="ts">
import { maindata } from '../model'
import StatCard from './stat-card.vue'
</script>

<template>
  <StatCard
    v-if="maindata"
    title="Statistics"
    :down="maindata.server_state.alltime_dl"
    :up="maindata.server_state.alltime_ul"
  />
</template>
