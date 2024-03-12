<script lang="ts">
  import { t } from 'shared/i18n'
  import { maindata } from '../model'
  import StatCard from './stat-card.svelte'
</script>

{#if $maindata}
  <StatCard title={$t('stats.space')} down={$maindata.server_state.free_space_on_disk} />
{/if}
