<script lang="ts">
  import { formatBytes } from 'shared/lib/format'
  import { Card, Icon, icons } from 'shared/ui'

  export let title: string
  export let down: number
  export let up: number = 0
</script>

<Card {title}>
  <div class="row mt-4">
    <Icon icon={icons.arrowDown} />

    <div>{formatBytes(down)}</div>
  </div>

  {#if up}
    <div class="row mt-2">
      <Icon icon={icons.arrowUpCircle} />
      <div>{formatBytes(up)}</div>
    </div>
  {/if}
</Card>

<style>
  .row {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    font-size: 32px;
    font-weight: bold;
  }

  /* Mobile */
  :global(#mobile) .row {
    font-size: 22px;
  }
</style>
