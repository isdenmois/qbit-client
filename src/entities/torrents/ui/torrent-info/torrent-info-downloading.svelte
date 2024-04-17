<script lang="ts">
  import { formatBytes, formatEta, formatNumber } from 'shared/lib/format'
  import { Icon, Progress, icons } from 'shared/ui'
  import { isEtaVisible } from 'shared/lib/utils'
  import { type Torrent } from '../../model'

  export let torrent: Torrent
</script>

<div class="flex items-center gap-4 md:gap-8">
  <p class="flex items-center gap-2">
    <span class="color-secondary"><Icon icon={icons.save} size={24} /></span>
    {formatBytes(torrent.size)}
  </p>

  {#if torrent.dlspeed}
    <p class="flex items-center gap-2">
      <span class="color-secondary"><Icon icon={icons.arrowDown} size={24} /></span>
      {formatBytes(torrent.dlspeed)}
    </p>
  {/if}

  {#if torrent.num_seeds}
    <p class="flex items-center gap-2 hidden-s">
      <span class="color-secondary"><Icon icon={icons.user} size={24} /></span>
      {torrent.num_seeds}
    </p>
  {/if}

  {#if isEtaVisible(torrent.eta)}
    <p class="flex items-center gap-2">
      <span class="color-secondary"><Icon icon={icons.clock} size={24} /></span>
      {formatEta(torrent.eta)}
    </p>
  {/if}

  <p class="flex-1 text-end self-end color-secondary">
    {formatNumber(torrent.progress * 100)}%
  </p>
</div>

<Progress value={torrent.progress} />
