<script setup lang="ts">
import { onMounted } from 'vue'
import { loadPreferences } from '@/entities/preferences'
import { ActiveDownloadsLimits, DownloadLimits, MaxRatioLimits, UploadLimits } from '@/features/limits'
import { Modal, ModalContent } from '@/shared/ui'

onMounted(loadPreferences)
</script>

<template>
  <Modal>
    <ModalContent title="Limits">
      <DownloadLimits />

      <div class="mt-8">
        <UploadLimits />
      </div>

      <div class="mt-8">
        <ActiveDownloadsLimits />
      </div>

      <div class="mt-8">
        <MaxRatioLimits />
      </div>
    </ModalContent>
  </Modal>
</template>
