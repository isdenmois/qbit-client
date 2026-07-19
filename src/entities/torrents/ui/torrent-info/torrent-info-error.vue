<script setup lang="ts">
import { type Torrent } from '../../model'

const props = defineProps<{ torrent: Torrent }>()
</script>

<template>
  <div>ERROR: {{ props.torrent.state }}</div>
</template>
