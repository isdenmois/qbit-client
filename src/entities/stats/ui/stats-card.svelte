<script lang="ts">
  import { maindata } from '../model'
  import StatCard from './stat-card.svelte'
</script>

{#if $maindata}
  <StatCard title="Statistics" down={$maindata.server_state.alltime_dl} up={$maindata.server_state.alltime_ul} />
{/if}
