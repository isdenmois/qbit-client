<script lang="ts">
  import { SpeedCard, LimitsCard, StatsCard, SpaceCard } from 'entities/stats'
  import {
    TorrentItem,
    activeTorrentsCount,
    activeTorrents,
    pausedTorrentsCount,
    pausedTorrents,
    completedTorrentsCount,
    completedTorrents,
  } from 'entities/torrents'
  import { api } from 'shared/api'
</script>

<div class="stats-row">
  <SpeedCard />
  <LimitsCard />
  <StatsCard />
  <SpaceCard />
</div>

<div class="flex flex-col gap-4">
  {#if $activeTorrentsCount > 0}
    <h1 class="mt-4">Active ({$activeTorrentsCount})</h1>

    {#each $activeTorrents as torrent}
      <TorrentItem {torrent} />
    {/each}
  {/if}

  {#if $pausedTorrentsCount > 0}
    <h1 class="mt-4">Paused ({$pausedTorrentsCount})</h1>

    {#each $pausedTorrents as torrent}
      <TorrentItem {torrent} />
    {/each}
  {/if}

  {#if $completedTorrentsCount > 0}
    <h1 class="mt-4">Completed ({$completedTorrentsCount})</h1>

    {#each $completedTorrents as torrent}
      <TorrentItem {torrent} />
    {/each}
  {/if}
</div>

<button class="mt-4" on:click={api.auth.logout}>Logout</button>

<style>
  .stats-row {
    display: flex;
    flex-wrap: wrap;
    gap: 2.5rem;
  }
</style>
