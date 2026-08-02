<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { maindata } from '../model'
import StatCard from './stat-card.vue'
</script>

<template>
  <RouterLink v-if="maindata" class="grid not-link" to="/limits">
    <StatCard title="Limits" :down="maindata.server_state.dl_rate_limit" :up="maindata.server_state.up_rate_limit" />
  </RouterLink>
</template>
