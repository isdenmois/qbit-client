<script lang="ts">
  import { Icon, icons } from 'shared/ui'
  import { locale } from 'shared/i18n'
  import { formatBytes, formatNumber } from 'shared/i18n/format'
  import { type Torrent } from '../../model'

  export let torrent: Torrent
</script>

<div class="flex items-center gap-4 md:gap-8">
  <p class="flex items-center gap-2">
    <span class="color-secondary"><Icon icon={icons.save} size={24} /></span>
    {formatBytes(torrent.size, $locale ?? 'ru')}
  </p>

  <p class="flex-1 text-end self-end color-secondary">
    {formatNumber(torrent.progress * 100)}%
  </p>

  <p>
    STATE: {torrent.state}
  </p>
</div>
