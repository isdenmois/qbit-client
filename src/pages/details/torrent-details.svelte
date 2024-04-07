<script lang="ts">
  import { maindata } from 'entities/stats'
  import { formatBytes, formatEta } from 'shared/i18n'
  import { formatDate, formatNumber } from 'shared/i18n/format'
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
      <Value title="Total Size">{$formatBytes(torrent.size)}</Value>
      <Value title="Added On">{formatDate(torrent.added_on)}</Value>
      <Value title="Save Path">{torrent.save_path}</Value>
      <Value title="Uploaded">{$formatBytes(torrent.uploaded)}</Value>
      <Value title="Share Ratio">{formatNumber(torrent.ratio)}</Value>

      {#if torrent.progress < 1}
        <Value title="Download Speed">{$formatBytes(torrent.dlspeed)}</Value>
        <Value title="Downloaded">{$formatBytes(torrent.downloaded)}</Value>
        <Value title="Progress">{formatNumber(torrent.progress * 100) + '%'}</Value>
        <Value title="Seeds">{torrent.num_seeds}</Value>
      {:else}
        <Value title="Completed On">{formatDate(torrent.completion_on)}</Value>
        <Value title="Upload Speed">{$formatBytes(torrent.upspeed)}</Value>
        <Value title="Leechs">{torrent.num_leechs}</Value>
      {/if}

      <Value title="ETA">{$formatEta(torrent.eta)}</Value>

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
