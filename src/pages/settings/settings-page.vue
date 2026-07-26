<script setup lang="ts">
import { api } from '@/shared/api'
</script>

<template>
  <button class="mt-4" @click="api.auth.logout">Logout</button>
</template>
