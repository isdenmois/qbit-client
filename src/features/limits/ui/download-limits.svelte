<script lang="ts">
import { maindata } from 'entities/stats'
import { icons } from 'shared/ui'
import { setDownloadLimit } from '../model'
import LimitsBlock from './limits-block.svelte'
</script>

<LimitsBlock
  icon={icons.arrowDown}
  limit={$maindata?.server_state.dl_rate_limit ?? 0}
  on:limitChange={(event) => setDownloadLimit(event.detail)}
/>
