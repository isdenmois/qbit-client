<script lang="ts">
  import { onMount } from 'svelte'
  import { LoginPage } from 'pages/login'
  import { HomePage } from 'pages/home'
  import { api } from 'shared/api'

  onMount(api.auth.init)

  const initialized = api.auth.initialized
  const isLoggedIn = api.auth.isLoggedIn
</script>

{#if $isLoggedIn}
  <HomePage />
{:else if $initialized}
  <LoginPage />
{:else}
  Loading...
{/if}
