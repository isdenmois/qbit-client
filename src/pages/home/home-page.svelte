<script lang="ts">
  import { Link } from 'svelte-routing'
  import { SpeedCard, LimitsCard, StatsCard, SpaceCard } from 'entities/stats'
  import {
    TorrentItem,
    activeTorrentsCount,
    activeTorrents,
    pausedTorrentsCount,
    pausedTorrents,
    completedFiltered,
    completedFilteredCount,
    completedCategories,
    toggleUploadedFilter,
    toggleCategoryFilter,
    filters,
  } from 'entities/torrents'
  import { Icon, icons } from 'shared/ui'
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

    {#each $activeTorrents as torrent (torrent.id)}
      <TorrentItem {torrent} />
    {/each}
  {/if}

  {#if $pausedTorrentsCount > 0}
    <h1 class="mt-4">Paused ({$pausedTorrentsCount})</h1>

    {#each $pausedTorrents as torrent (torrent.id)}
      <TorrentItem {torrent} />
    {/each}
  {/if}

  <h1 class="mt-4">Completed ({$completedFilteredCount})</h1>

  <div class="flex flex-wrap gap-2">
    <button class="secondary" class:selected={$filters.uploaded} on:click={toggleUploadedFilter}> Ratio > 1 </button>

    {#each $completedCategories as category (category)}
      <button
        class="secondary"
        class:selected={$filters.category === category}
        on:click={() => toggleCategoryFilter(category)}
      >
        {category}</button
      >
    {/each}
  </div>

  {#each $completedFiltered as torrent (torrent.id)}
    <TorrentItem {torrent} />
  {/each}
</div>

<div class="add">
  <Link class="flex h-full items-center justify-center not-link" to="/add">
    <Icon icon={icons.plus} />
  </Link>
</div>

<style>
  .stats-row {
    display: grid;
    grid-gap: 2.5rem;
    grid-template-columns: repeat(auto-fill, 15rem);
  }

  .add {
    position: absolute;
    right: 1rem;
    bottom: 5rem;
    height: 4rem;
    width: 4rem;
    background-color: var(--add);
    color: var(--background);
    border-radius: 50%;
    box-shadow: -8px 0px 16px -4px rgba(0, 0, 0, 0.1);
  }

  /* Mobile */
  :global(#mobile) .stats-row {
    grid-gap: 1rem;
    grid-template-columns: repeat(auto-fill, calc(50vw - 1.5rem));
  }

  .selected {
    background-color: var(--success);
  }
</style>
