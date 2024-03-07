<script lang="ts">
  import { t } from 'shared/i18n'
  import { Card } from 'shared/ui'
  import { maindata } from '../model'
</script>

<Card title={$t('stats.speed')}>
  <div>{$maindata?.server_state.dl_info_speed}</div>
  <div>{$maindata?.server_state.up_info_speed}</div>
</Card>
