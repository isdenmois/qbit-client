<script lang="ts">
  import { api } from 'shared/api'
  import type { SearchResult } from 'shared/api/jk'
  import { compare, focusOnMount } from 'shared/lib/utils'
  import { icons } from 'shared/ui'
  import Icon from 'shared/ui/icon.svelte'
  import Loading from 'shared/ui/loading.svelte'

  let query = ''
  let loading = false
  let results: SearchResult[] = []
  let found = results.length
  let sortBy = 'seeders'

  $: items = sortBy === 'date' ? results : results.toSorted(compare((item) => item.Seeders)).reverse()

  const reset = () => {
    results = []
    found = 0
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru')
  }

  const search = async () => {
    loading = true
    reset()

    try {
      const { Results } = await api.jk.search(query)

      results = Results
      found = Results.length
    } finally {
      loading = false
    }
  }

  const orders = [
    { id: 'seeders', label: 'Seeders' },
    { id: 'date', label: 'Date' },
  ]
</script>

<form class="flex" on:submit|preventDefault={search}>
  <input
    class="flex-1"
    placeholder="Query"
    type="text"
    bind:value={query}
    disabled={loading}
    on:input={reset}
    use:focusOnMount
  />
</form>

<div class="mt-2 flex gap-2">
  {#each orders as order}
    <button class:secondary={sortBy !== order.id} on:click={() => (sortBy = order.id)}>{order.label}</button>
  {/each}
</div>

{#if found > 0}
  <h3 class="mt-4">Found {found}</h3>
{/if}

{#if loading}
  <div class="flex place-content-center">
    <Loading />
  </div>
{/if}

<ul>
  {#each items as item (item.Guid)}
    <li class="mt-4 flex gap-1">
      <a class="flex flex-col not-link" href={item.Details} target="_blank">
        <div class="shrink-0 min-w-16 description">
          {formatDate(item.PublishDate)}
          {item.Tracker}
          ({item.Seeders} / {item.Peers})
        </div>

        <div>
          {item.Title}
        </div>
      </a>

      <a class="not-link" href={item.Link} target="_blank">
        <Icon icon={icons.download} />
      </a>
    </li>
  {/each}
</ul>

<style>
  .description {
    font-size: 12px;
  }
</style>
