<script lang="ts">
  import { Icon, icons } from 'shared/ui'
  import { locale } from 'shared/i18n'
  import { formatBytes } from 'shared/i18n/format'
  import { type Torrent } from '../../model'

  export let torrent: Torrent
</script>

<div class="flex items-center gap-8">
  <p class="flex items-center gap-2">
    <Icon icon={icons.save} size={24} />
    {formatBytes(torrent.size, $locale ?? 'ru')}
  </p>

  {#if torrent.upspeed}
    <p class="flex items-center gap-2">
      <Icon icon={icons.arrowUp} size={24} />
      {formatBytes(torrent.upspeed, $locale ?? 'ru')}
    </p>
  {/if}
</div>
