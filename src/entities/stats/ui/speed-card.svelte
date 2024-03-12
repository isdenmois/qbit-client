<script lang="ts">
  import { t } from 'shared/i18n'
  import { maindata } from '../model'
  import StatCard from './stat-card.svelte'
</script>

{#if $maindata}
  <StatCard
    title={$t('stats.speed')}
    down={$maindata.server_state.dl_info_speed}
    up={$maindata.server_state.up_info_speed}
  />
{/if}
