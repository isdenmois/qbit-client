<script lang="ts">
  import { icons } from 'shared/ui'
  import { maindata } from 'entities/stats'
  import { setUploadLimit } from '../model'
  import LimitsBlock from './limits-block.svelte'
</script>

<LimitsBlock
  icon={icons.arrowUp}
  limit={$maindata?.server_state.up_rate_limit ?? 0}
  on:limitChange={(event) => setUploadLimit(event.detail)}
/>
