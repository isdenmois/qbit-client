<script lang="ts">
  import { icons } from 'shared/ui'
  import { maindata } from 'entities/stats'
  import { setDownloadLimit } from '../model'
  import LimitsBlock from './limits-block.svelte'
</script>

<LimitsBlock
  icon={icons.arrowDown}
  limit={$maindata?.server_state.dl_rate_limit ?? 0}
  on:limitChange={(event) => setDownloadLimit(event.detail)}
/>
