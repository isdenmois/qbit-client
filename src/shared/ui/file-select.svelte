<script lang="ts">
  import { onMount } from 'svelte'
  import Icon from './icon.svelte'
  import { icons } from './icons'

  export let accept: string
  export let files: FileList | null
  export let autoselect = false

  $: hasFile = files?.length
  let fileInput: HTMLInputElement

  onMount(() => {
    if (autoselect) {
      fileInput.click()
    }
  })
</script>

<label class:selected={hasFile}>
  <input class="hidden" bind:this={fileInput} type="file" bind:files {accept} />

  <div class="flex items-center gap-2" class:flex-col={!hasFile}>
    {#if files?.length}
      <Icon icon={icons.file} />

      <div>{files[0].name}</div>
    {:else}
      <Icon icon={icons.documentPlus} />

      <div>Choose a file or drag here</div>
    {/if}
  </div>
</label>

<style>
  label {
    border: 1px dashed var(--secondary);
    border-radius: 0.5rem;
    padding: 1rem;
    cursor: pointer;
  }

  label.selected {
    border-width: 0;
    padding: 0;
  }
</style>
