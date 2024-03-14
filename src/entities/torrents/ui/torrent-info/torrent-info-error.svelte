<script lang="ts">
  import { type Torrent } from '../../model'

  export let torrent: Torrent
</script>

<div>
  ERROR: {torrent.state}
</div>
