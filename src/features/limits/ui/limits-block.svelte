<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { formatBytes } from 'shared/lib/format'
  import { Icon } from 'shared/ui'

  export let icon: string
  export let limit: number

  const limits = [1, 2, 3, 5, 8, 10].map((limitB) => limitB * 1024 * 1024)

  const dispatch = createEventDispatcher<{ limitChange: number }>()
</script>

<div class="flex gap-2">
  <Icon {icon} />
  <h1>{formatBytes(limit)}</h1>
</div>

<div class="mt-2 flex flex-wrap gap-2">
  {#each limits as limitMb}
    <button class:secondary={limit !== limitMb} on:click={() => dispatch('limitChange', limitMb)}>
      {formatBytes(limitMb)}</button
    >
  {/each}
</div>
