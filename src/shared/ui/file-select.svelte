<script lang="ts">
  import Icon from './icon.svelte'
  import { icons } from './icons'

  export let accept: string
  export let files: FileList | null
  export let autoselect = false
  export let multiple = false

  $: hasFile = files?.length

  function selectOnMount(node: HTMLInputElement) {
    if (autoselect) {
      node.click()
    }
  }
</script>

<label class:selected={hasFile}>
  <input class="hidden" use:selectOnMount type="file" bind:files {multiple} {accept} />

  <div class="flex items-center gap-2" class:flex-col={!hasFile}>
    {#if files?.length}
      <Icon icon={icons.file} />

      <div class="flex flex-col gap-3">
        {#each [...files] as file (file.name)}
          <div>{file.name}</div>
        {/each}
      </div>
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
