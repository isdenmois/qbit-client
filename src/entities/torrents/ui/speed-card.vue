<script setup lang="ts">
import { maindata } from '../model'
import StatCard from './stat-card.vue'
</script>

<template>
  <StatCard
    v-if="maindata"
    title="Speed"
    :down="maindata.server_state.dl_info_speed"
    :up="maindata.server_state.up_info_speed"
  />
</template>
