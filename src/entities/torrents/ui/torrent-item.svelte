<script lang="ts">
  import { Link } from 'svelte-routing'
  import { Card } from 'shared/ui'
  import { type Torrent } from '../model'
  import {
    TorrentInfoCompleted,
    TorrentInfoDownloading,
    TorrentInfoError,
    TorrentInfoOther,
    TorrentInfoPaused,
  } from './torrent-info'

  export let torrent: Torrent
</script>

<Link class="not-link" to={`torrent/${torrent.id}`}>
  <Card>
    <div class="content flex flex-col gap-2">
      <h3>{torrent.name}</h3>

      {#if torrent.progress >= 1}
        <TorrentInfoCompleted {torrent} />
      {:else if torrent.state === 'downloading'}
        <TorrentInfoDownloading {torrent} />
      {:else if torrent.state === 'pausedDL'}
        <TorrentInfoPaused {torrent} />
      {:else if torrent.state === 'missingFiles'}
        <TorrentInfoError {torrent} />
      {:else}
        <TorrentInfoOther {torrent} />
      {/if}
    </div>
  </Card>
</Link>

<style>
  h3 {
    font-size: 20px;
    font-weight: bold;
  }

  @media only screen and (max-device-width: 500px) {
    h3 {
      font-size: 14px;
    }

    .content {
      font-size: 12px;
    }
  }
</style>
