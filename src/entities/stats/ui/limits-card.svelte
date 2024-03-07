<script lang="ts">
  import { t } from 'shared/i18n'
  import { Card } from 'shared/ui'
  import { maindata } from '../model'
</script>

<Card title={$t('stats.limits')}>
  <div>{$maindata?.server_state.dl_rate_limit}</div>
  <div>{$maindata?.server_state.up_rate_limit}</div>
</Card>
