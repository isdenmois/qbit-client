<script lang="ts">
  import { maindata } from '../model'
  import StatCard from './stat-card.svelte'
</script>

{#if $maindata}
  <StatCard title="Free Space" down={$maindata.server_state.free_space_on_disk} />
{/if}
