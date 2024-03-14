<script lang="ts">
  import { Icon, icons } from 'shared/ui'
  import { locale } from 'shared/i18n'
  import { formatBytes, formatNumber } from 'shared/i18n/format'
  import { type Torrent } from '../../model'

  export let torrent: Torrent
</script>

<div class="flex items-center gap-8">
  <p class="flex items-center gap-2">
    <Icon icon={icons.save} size={24} />
    {formatBytes(torrent.size, $locale ?? 'ru')}
  </p>

  <p class="flex-1 text-end">
    {formatNumber(torrent.progress * 100)}%
  </p>

  <p>
    STATE: {torrent.state}
  </p>
</div>
