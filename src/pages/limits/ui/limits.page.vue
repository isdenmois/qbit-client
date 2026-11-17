<script setup lang="ts">
import { onMounted } from 'vue'
import { loadPreferences } from '@/entities/preferences'
import { Modal, ModalContent } from '@/shared/ui'
import { ActiveDownloadsLimits, DownloadLimits, MaxRatioLimits, UploadLimits } from './index'

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
