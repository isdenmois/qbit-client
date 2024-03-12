<script lang="ts">
  import { t } from 'shared/i18n'
  import { maindata } from '../model'
  import StatCard from './stat-card.svelte'
</script>

{#if $maindata}
  <StatCard
    title={$t('stats.limits')}
    down={$maindata.server_state.dl_rate_limit}
    up={$maindata.server_state.up_rate_limit}
  />
{/if}
