<script lang="ts">
  import { maindata } from '../model'
  import StatCard from './stat-card.svelte'
  import { Link } from 'svelte-routing'
</script>

{#if $maindata}
  <Link class="not-link" to="/limits">
    <StatCard title="Limits" down={$maindata.server_state.dl_rate_limit} up={$maindata.server_state.up_rate_limit} />
  </Link>
{/if}
