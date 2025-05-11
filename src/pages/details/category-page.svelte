<script lang="ts">
  import { maindata } from 'entities/stats'
  import { categories } from 'entities/torrents'
  import { api } from 'shared/api'
  import { ModalContent } from 'shared/ui'

  export let id: string

  let selectedCategory: string | null

  $: torrent = $maindata?.torrents[id]
  $: selectedCategory = torrent?.category || null

  const change = (categoryId: string) => {
    api.torrent.setCategory(id, categoryId)
    selectedCategory = categoryId
  }
</script>

<ModalContent title={torrent?.name || ''}>
  <ul>
    {#each $categories as category (category.id)}
      <li class="mb-2">
        <button class:secondary={category.id !== selectedCategory} on:click={() => change(category.id)}>
          {category.id}
        </button>
      </li>
    {/each}
  </ul>
</ModalContent>
