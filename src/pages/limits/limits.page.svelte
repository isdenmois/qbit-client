<script lang="ts">
  import { t } from 'shared/i18n'
  import { ModalContent } from 'shared/ui'
  import { DownloadLimits, UploadLimits } from 'features/limits'
</script>

<ModalContent title={$t('stats.limits')}>
  <DownloadLimits />

  <div class="mt-8">
    <UploadLimits />
  </div>
</ModalContent>
