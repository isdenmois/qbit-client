<script lang="ts">
  import { categories } from 'entities/torrents'
  import { api } from 'shared/api'
  import { ModalContent } from 'shared/ui'
  import { navigate } from 'svelte-routing'

  let files: FileList | null
  let category = ''
  let sequentialDownload = true

  const submit = async () => {
    if (files?.length && category) {
      const result = await api.torrent.add(files[0], category, sequentialDownload)

      if (result) {
        navigate('/')
      } else {
        alert('Error!')
      }
    }
  }
</script>

<ModalContent title="Add a torrent">
  <form class="flex flex-col gap-4" on:submit|preventDefault={submit}>
    <label>
      Choose a file
      <input type="file" bind:files accept=".torrent" />
    </label>

    <label class="flex flex-col">
      Category
      <select bind:value={category}>
        <option value="">NONE</option>

        {#each $categories as category (category.id)}
          <option value={category.id}>{category.name}</option>
        {/each}
      </select>
    </label>

    <label>
      <input type="checkbox" bind:checked={sequentialDownload} />
      Sequential Download
    </label>

    <button>Send</button>
  </form>
</ModalContent>
