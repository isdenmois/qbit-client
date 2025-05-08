<script lang="ts">
  import { api } from 'shared/api'
  import type { SearchResult } from 'shared/api/search'
  import { compare, focusOnMount } from 'shared/lib/utils'
  import { icons } from 'shared/ui'
  import Icon from 'shared/ui/icon.svelte'
  import Loading from 'shared/ui/loading.svelte'

  let query = ''
  let loading = false
  let results: SearchResult[] = []
  let found = results.length
  let sortBy = 'seeders'

  $: items = sortBy === 'date' ? results : results.toSorted(compare((item) => item.nbSeeders)).reverse()

  const reset = () => {
    results = []
    found = 0
  }

  const search = async () => {
    loading = true
    reset()

    try {
      const { id } = await api.search.start(query)
      let res

      do {
        await new Promise((r) => setTimeout(r, 500))
        res = await api.search.results(id)
      } while (res.status == 'Running')

      results = res.results
      found = res.total
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
  {#each items as item (item.fileUrl)}
    <li class="mt-4 flex gap-1">
      <a class="not-link" href={item.descrLink} target="_blank">
        {item.fileName}
      </a>

      <div class="shrink-0 min-w-16">
        {item.nbSeeders} / {item.nbLeechers}
      </div>

      <a class="not-link" href={item.fileUrl} target="_blank">
        <Icon icon={icons.download} />
      </a>
    </li>
  {/each}
</ul>
