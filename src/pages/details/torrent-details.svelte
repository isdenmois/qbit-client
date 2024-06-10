<script lang="ts">
  import { maindata } from 'entities/stats'
  import { isPaused, resumeTorrent, pauseTorrent, deleteTorrent } from 'entities/torrents'
  import { formatBytes, formatDate, formatEta, formatNumber } from 'shared/lib/format'
  import { isEtaVisible } from 'shared/lib/utils'
  import { Icon, ModalContent, Value, icons } from 'shared/ui'
  import { api } from 'shared/api'

  import { navigate } from 'svelte-routing'

  export let id: string

  $: torrent = $maindata?.torrents[id]
  $: propertiesQuery = api.torrent.properties(id)

  const resume = () => resumeTorrent(id)

  const pause = () => pauseTorrent(id)

  const remove = async () => {
    if (confirm('Are you sure you want to delete this torrent?')) {
      const deleteFiles = confirm('Delete files too?')

      await deleteTorrent(id, deleteFiles)

      navigate('/')
    }
  }
</script>

{#if torrent}
  <ModalContent title={torrent.name}>
    <h1>Information</h1>

    <div class="mt-4 flex flex-col gap-4">
      <Value title="Total Size">{formatBytes(torrent.size)}</Value>
      <Value title="Added On">{formatDate(torrent.added_on)}</Value>
      <Value title="Save Path">{torrent.save_path}</Value>
      <Value title="Uploaded">{formatBytes(torrent.uploaded)}</Value>
      <Value title="Share Ratio">{formatNumber(torrent.ratio)}</Value>

      {#if torrent.progress < 1}
        <Value title="Download Speed">{formatBytes(torrent.dlspeed)}</Value>
        <Value title="Downloaded">{formatBytes(torrent.downloaded)}</Value>
        <Value title="Progress">{formatNumber(torrent.progress * 100) + '%'}</Value>
        <Value title="Seeds">{torrent.num_seeds}</Value>
      {:else}
        <Value title="Completed On">{formatDate(torrent.completion_on)}</Value>
        <Value title="Upload Speed">{formatBytes(torrent.upspeed)}</Value>
        <Value title="Leechs">{torrent.num_leechs}</Value>
      {/if}

      {#if isEtaVisible(torrent.eta)}
        <Value title="ETA">{formatEta(torrent.eta)}</Value>
      {/if}

      {#await propertiesQuery then properties}
        {#if properties.comment}
          <Value title="Comment">{properties.comment}</Value>
        {/if}
      {/await}
    </div>

    <div slot="bottom" class="flex gap-4 px-4 md:px-8 py-2">
      {#if isPaused(torrent)}
        <button on:click={resume}>
          <Icon icon={icons.play} />
        </button>
      {:else}
        <button on:click={pause}>
          <Icon icon={icons.pause} />
        </button>
      {/if}

      <button class="danger" on:click={remove}>
        <Icon icon={icons.trash} />
      </button>
    </div>
  </ModalContent>
{:else if $maindata}
  Not Found
{/if}
