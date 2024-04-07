<script lang="ts">
  import { maindata } from 'entities/stats'
  import { formatBytes, formatDate, formatEta, formatNumber } from 'shared/i18n/format'
  import { locale } from 'shared/i18n'
  import { ModalContent, Value } from 'shared/ui'
  import { api } from 'shared/api'

  export let id: string

  $: torrent = $maindata?.torrents[id]
  $: propertiesQuery = api.torrent.properties(id)
</script>

{#if torrent}
  <ModalContent title={torrent.name}>
    <h1>Information</h1>

    <div class="mt-4 flex flex-col gap-4">
      <Value title="Total Size">{formatBytes(torrent.size, $locale ?? 'ru')}</Value>
      <Value title="Added On">{formatDate(torrent.added_on)}</Value>
      <Value title="Save Path">{torrent.save_path}</Value>
      <Value title="Uploaded">{formatBytes(torrent.uploaded, $locale ?? 'ru')}</Value>
      <Value title="Share Ratio">{formatNumber(torrent.ratio)}</Value>

      {#if torrent.progress < 1}
        <Value title="Download Speed">{formatBytes(torrent.dlspeed, $locale ?? 'ru')}</Value>
        <Value title="Downloaded">{formatBytes(torrent.downloaded, $locale ?? 'ru')}</Value>
        <Value title="Progress">{formatNumber(torrent.progress * 100) + '%'}</Value>
        <Value title="Seeds">{torrent.num_seeds}</Value>
      {:else}
        <Value title="Completed On">{formatDate(torrent.completion_on)}</Value>
        <Value title="Upload Speed">{formatBytes(torrent.upspeed, $locale ?? 'ru')}</Value>
        <Value title="Leechs">{torrent.num_leechs}</Value>
      {/if}

      <Value title="ETA">{formatEta(torrent.eta, $locale ?? 'ru')}</Value>

      {#await propertiesQuery then properties}
        {#if properties.comment}
          <Value title="Comment">{properties.comment}</Value>
        {/if}
      {/await}
    </div>
  </ModalContent>
{:else if $maindata}
  Not Found
{/if}
