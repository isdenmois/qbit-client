<script lang="ts">
  import { categories, category, selectCategory, TorrentItem, torrentsFiltered } from 'entities/torrents'
</script>

<h1>Torrents ({$torrentsFiltered.length})</h1>

<div class="mt-4 flex flex-wrap gap-2">
  {#each $categories as cat (cat.id)}
    <button class="secondary" class:selected={$category === cat.id} on:click={() => selectCategory(cat.id)}
      >{cat.name}</button
    >
  {/each}
</div>

<div class="mt-4 flex flex-col gap-4">
  {#each $torrentsFiltered as torrent (torrent.id)}
    <TorrentItem {torrent} />
  {/each}
</div>
