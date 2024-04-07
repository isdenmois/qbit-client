<script lang="ts">
  import { Icon, Progress, icons } from 'shared/ui'
  import { locale } from 'shared/i18n'
  import { formatBytes, formatNumber, formatEta } from 'shared/i18n/format'
  import { type Torrent } from '../../model'

  export let torrent: Torrent

  const MAX_ETA = 1_000_000
</script>

<div class="flex items-center gap-4 md:gap-8">
  <p class="flex items-center gap-2">
    <span class="color-secondary"><Icon icon={icons.save} size={24} /></span>
    {formatBytes(torrent.size, $locale ?? 'ru')}
  </p>

  {#if torrent.dlspeed}
    <p class="flex items-center gap-2">
      <span class="color-secondary"><Icon icon={icons.arrowDown} size={24} /></span>
      {formatBytes(torrent.dlspeed, $locale ?? 'ru')}
    </p>
  {/if}

  {#if torrent.num_seeds}
    <p class="flex items-center gap-2 hidden-s">
      <span class="color-secondary"><Icon icon={icons.user} size={24} /></span>
      {torrent.num_seeds}
    </p>
  {/if}

  {#if torrent.eta > 0 && torrent.eta < MAX_ETA}
    <p class="flex items-center gap-2">
      <span class="color-secondary"><Icon icon={icons.clock} size={24} /></span>
      {formatEta(torrent.eta, $locale ?? 'ru')}
    </p>
  {/if}

  <p class="flex-1 text-end self-end color-secondary">
    {formatNumber(torrent.progress * 100)}%
  </p>
</div>

<Progress value={torrent.progress} />
