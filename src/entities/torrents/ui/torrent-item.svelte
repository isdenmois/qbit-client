<script lang="ts">
  import { Card, Icon, Progress, icons } from 'shared/ui'
  import { locale } from 'shared/i18n'
  import { formatBytes, formatNumber, formatEta } from 'shared/i18n/format'
  import { type Torrent } from '../model'

  export let torrent: Torrent
</script>

<Card title={torrent.name}>
  <div class="info">
    {#if torrent.dlspeed}
      <p>
        <Icon icon={icons.arrowDown} size={24} />
        {formatBytes(torrent.dlspeed, $locale ?? 'ru')}
      </p>
    {/if}

    {#if torrent.upspeed}
      <p>
        <Icon icon={icons.arrowUp} size={24} />
        {formatBytes(torrent.upspeed, $locale ?? 'ru')}
      </p>
    {/if}

    <p>
      ETA: {formatEta(torrent.eta, $locale ?? 'ru')}
    </p>

    <p class="percent">
      {formatNumber(torrent.progress * 100)}%
    </p>
  </div>

  <Progress value={torrent.progress} />
</Card>

<style>
  .info {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  p {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
