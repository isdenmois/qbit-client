<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { maindata } from '@/entities/stats'
import { TorrentContent } from '@/features/torrent-content'

const route = useRoute()
const id = route.params.id as string

const torrent = computed(() => maindata.value?.torrents[id])
</script>

<template>
  <TorrentContent :id="id" :title="torrent?.name ?? ''" />
</template>
