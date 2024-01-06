<script lang="ts">
  import { api } from 'shared/api'
</script>

{#await api.app.version()}
  <div>Loading...</div>
{:then version}
  <p>version: {version}</p>
{/await}

<button on:click={api.auth.logout}>Logout</button>
