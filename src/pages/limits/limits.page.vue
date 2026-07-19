<script setup lang="ts">
import { DownloadLimits, UploadLimits } from 'features/limits'
import { Modal, ModalContent } from 'shared/ui'
</script>

<template>
  <Modal>
    <ModalContent title="Limits">
      <DownloadLimits />

      <div class="mt-8">
        <UploadLimits />
      </div>
    </ModalContent>
  </Modal>
</template>
