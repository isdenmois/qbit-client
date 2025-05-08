<script lang="ts">
  import { onMount } from 'svelte'
  import { LoginPage } from 'pages/login'
  import { api } from 'shared/api'
  import { Loading } from 'shared/ui'
  import AppRouter from './router.svelte'

  onMount(api.auth.init)

  const initialized = api.auth.initialized
  const isLoggedIn = api.auth.isLoggedIn
</script>

{#if $isLoggedIn}
  <AppRouter />
{:else if $initialized}
  <LoginPage />
{:else}
  <div class="h-screen flex justify-center items-center">
    <Loading />
  </div>
{/if}
