<script lang="ts">
  import { Link } from 'svelte-routing'
  import { SpeedCard, LimitsCard, StatsCard, SpaceCard } from 'entities/stats'
  import {
    TorrentItem,
    downloadingTorrents,
    completedFiltered,
    completedCategories,
    toggleUploadedFilter,
    toggleUploadingFilter,
    toggleCategoryFilter,
    filters,
    completedTorrents,
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
  {#if $downloadingTorrents.length > 0}
    <h1 class="mt-4">Active ({$downloadingTorrents.length})</h1>

    {#each $downloadingTorrents as torrent (torrent.id)}
      <TorrentItem {torrent} />
    {/each}
  {/if}

  {#if $completedFiltered.length !== $completedTorrents.length}
    <h1 class="mt-4">Completed ({$completedFiltered.length} / {$completedTorrents.length})</h1>
  {:else}
    <h1 class="mt-4">Completed ({$completedTorrents.length})</h1>
  {/if}

  <div class="flex flex-wrap gap-2">
    <button class="secondary" class:selected={$filters.uploaded} on:click={toggleUploadedFilter}> Ratio > 1 </button>
    <button class="secondary" class:selected={$filters.uploading} on:click={toggleUploadingFilter}>Uploading</button>

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
</style>
