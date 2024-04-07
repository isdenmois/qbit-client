<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { locale } from 'svelte-i18n'
  import { formatBytes } from 'shared/i18n/format'
  import { Icon } from 'shared/ui'

  export let icon: string
  export let limit: number

  const limits = [1, 2, 3, 5, 8, 10]

  const dispatch = createEventDispatcher<{ limitChange: number }>()
</script>

<div class="flex gap-2">
  <Icon {icon} />
  <h1>{formatBytes(limit, $locale ?? 'ru')}</h1>
</div>

<div class="mt-2 flex flex-wrap gap-2">
  {#each limits as limitMb}
    <button on:click={() => dispatch('limitChange', limitMb * 1024 * 1024)}
      >{formatBytes(limitMb * 1024 * 1024, $locale ?? 'ru')}</button
    >
  {/each}
</div>
