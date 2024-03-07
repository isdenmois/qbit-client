<script lang="ts">
  import { t } from 'shared/i18n'
  import { Card } from 'shared/ui'
  import { maindata } from '../model'
</script>

<Card title={$t('stats.space')}>
  <div>{$maindata?.server_state.free_space_on_disk}</div>
</Card>
