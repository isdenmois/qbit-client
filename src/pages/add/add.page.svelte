<script lang="ts">
  import { categories } from 'entities/torrents'
  import { api } from 'shared/api'
  import { FileSelect, ModalContent } from 'shared/ui'
  import { navigate } from 'svelte-routing'

  let files: FileList | null
  let category = ''
  let sequentialDownload = true

  $: disabled = !files?.length

  const submit = async () => {
    if (files?.length) {
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
    <FileSelect bind:files accept=".torrent" autoselect />

    <h2>Category</h2>

    <label>
      <input checked={!category} on:change={() => (category = '')} type="radio" name="category" value="" /> None
    </label>

    {#each $categories as cat (cat.id)}
      <label>
        <input
          checked={category === cat.id}
          on:change={() => (category = cat.id)}
          type="radio"
          name="category"
          value={cat.id}
        />
        {cat.name}
      </label>
    {/each}

    <label>
      <input type="checkbox" bind:checked={sequentialDownload} />
      Sequential Download
    </label>

    <button {disabled}>Send</button>
  </form>
</ModalContent>
