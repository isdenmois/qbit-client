<script setup lang="ts">
import { onMounted } from 'vue'
import { LoginPage } from '@/pages/login'
import { api } from '@/shared/api'
import { Loading } from '@/shared/ui'
import Layout from './layout.vue'

onMounted(() => {
  api.auth.init()
})
</script>

<template>
  <Layout v-if="api.auth.isLoggedIn.value" />

  <LoginPage v-else-if="api.auth.initialized.value" />

  <div v-else class="h-screen flex justify-center items-center">
    <Loading />
  </div>
</template>
