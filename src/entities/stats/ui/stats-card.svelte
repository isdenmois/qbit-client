<script lang="ts">
  import { t } from 'shared/i18n'
  import { maindata } from '../model'
  import StatCard from './stat-card.svelte'
</script>

{#if $maindata}
  <StatCard title={$t('stats.stats')} down={$maindata.server_state.alltime_dl} up={$maindata.server_state.alltime_ul} />
{/if}
