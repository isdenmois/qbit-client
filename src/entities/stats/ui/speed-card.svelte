<script lang="ts">
  import { maindata } from '../model'
  import StatCard from './stat-card.svelte'
</script>

{#if $maindata}
  <StatCard title="Speed" down={$maindata.server_state.dl_info_speed} up={$maindata.server_state.up_info_speed} />
{/if}
