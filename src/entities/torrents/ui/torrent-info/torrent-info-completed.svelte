<script lang="ts">
  import { formatBytes } from 'shared/lib/format'
  import { Icon, icons } from 'shared/ui'
  import { type Torrent } from '../../model'

  export let torrent: Torrent
</script>

<div class="flex items-center gap-4 md:gap-8">
  <p class="flex items-center gap-2">
    <span class="color-secondary"><Icon icon={icons.save} size={24} /></span>
    {formatBytes(torrent.size)}
  </p>

  {#if torrent.upspeed}
    <p class="flex items-center gap-2">
      <span class="color-secondary"><Icon icon={icons.arrowUpCircle} size={24} /></span>
      {formatBytes(torrent.upspeed)}
    </p>
  {/if}
</div>
