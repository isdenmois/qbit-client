<script lang="ts">
  import { ModalContent } from 'shared/ui'
  import { DownloadLimits, UploadLimits } from 'features/limits'
</script>

<ModalContent title="Limits">
  <DownloadLimits />

  <div class="mt-8">
    <UploadLimits />
  </div>
</ModalContent>
