<script lang="ts">
  import { onMount } from 'svelte'
  import { LoginPage } from 'pages/login'
  import AppRouter from './router.svelte'
  import { api } from 'shared/api'

  onMount(api.auth.init)

  const initialized = api.auth.initialized
  const isLoggedIn = api.auth.isLoggedIn
</script>

{#if $isLoggedIn}
  <AppRouter />
{:else if $initialized}
  <LoginPage />
{:else}
  Loading...
{/if}
