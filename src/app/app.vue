<script setup lang="ts">
import { onMounted, onUnmounted, provide } from 'vue'
import { createMainDataPoller, MainDataPollerKey } from '@/entities/stats'
import { LoginPage } from '@/pages/login'
import { api } from '@/shared/api'
import { Loading, ToastHost } from '@/shared/ui'
import { AppLayout } from './ui'

const poller = createMainDataPoller()
provide(MainDataPollerKey, poller)

onMounted(() => {
  api.auth.init()
})

onUnmounted(() => {
  poller.destroy()
})
</script>

<template>
  <AppLayout v-if="api.auth.isLoggedIn.value" />

  <LoginPage v-else-if="api.auth.initialized.value" />

  <div v-else class="h-screen flex justify-center items-center">
    <Loading />
  </div>

  <ToastHost />
</template>
