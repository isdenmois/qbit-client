<script lang="ts">
import { DownloadLimits, UploadLimits } from 'features/limits'
import { ModalContent } from 'shared/ui'
</script>

<ModalContent title="Limits">
  <DownloadLimits />

  <div class="mt-8">
    <UploadLimits />
  </div>
</ModalContent>
