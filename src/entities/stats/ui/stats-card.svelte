<script lang="ts">
  import { t } from 'shared/i18n'
  import { Card } from 'shared/ui'
  import { maindata } from '../model'
</script>

<Card title={$t('stats.stats')}>
  <div>{$maindata?.server_state.alltime_dl}</div>
  <div>{$maindata?.server_state.alltime_ul}</div>
</Card>
