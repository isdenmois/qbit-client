<script lang="ts">
  import { SpeedCard, LimitsCard, StatsCard, SpaceCard } from 'entities/stats'
  import { api } from 'shared/api'
</script>

<div class="stats-row">
  <SpeedCard />
  <LimitsCard />
  <StatsCard />
  <SpaceCard />
</div>

{#await api.app.version()}
  <div>Loading...</div>
{:then version}
  <p>version: {version}</p>
{/await}

<button on:click={api.auth.logout}>Logout</button>

<style>
  .stats-row {
    display: flex;
    gap: 2.5rem;
  }
</style>
