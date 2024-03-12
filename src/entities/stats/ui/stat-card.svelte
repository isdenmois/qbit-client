<script lang="ts">
  import { locale } from 'svelte-i18n'
  import { formatBytes } from 'shared/i18n/format'
  import { Card, Icon, icons } from 'shared/ui'

  export let title: string
  export let down: number
  export let up: number = 0
</script>

<Card {title}>
  <div class="row">
    <Icon icon={icons.arrowDown} />

    <div>{formatBytes(down, $locale ?? 'ru')}</div>
  </div>

  {#if up}
    <div class="row">
      <Icon icon={icons.arrowUp} />
      <div>{formatBytes(up, $locale ?? 'ru')}</div>
    </div>
  {/if}
</Card>

<style>
  .row {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
  }
</style>
