<script setup lang="ts">
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import { MainDataPollerKey } from '@/entities/stats'
import { categories } from '@/entities/torrents'
import { TorrentContent } from '@/features/torrent-content'
import { api } from '@/shared/api'
import { FileSelect, Icon, icons, Modal, ModalContent, showToast } from '@/shared/ui'
import { useAddTorrent } from './model'

const {
  files,
  category,
  sequentialDownload,
  selectPriorities,
  hasPending,
  hasSingleFile,
  disabled,
  metadata,
  metadataFiles,
  backToForm,
  getFilePriorities,
  getParsedUrl,
} = useAddTorrent()

const router = useRouter()
const poller = inject(MainDataPollerKey)

const submit = async () => {
  if (!files.value?.length) return

  const fileList = [...files.value]
  const filePriorities = getFilePriorities()
  const parsedUrl = getParsedUrl()
  const result = await (filePriorities && parsedUrl
    ? api.torrent.addParsed(parsedUrl, category.value, sequentialDownload.value, filePriorities)
    : api.torrent.add(fileList, category.value, sequentialDownload.value))

  if (result.success_count === 0 || result.failure_count > 0) {
    return showToast(`Failed to add ${result.failure_count} of ${fileList.length} files`, 'error')
  }

  poller?.refresh()
  router.replace('/')
}
</script>

<template>
  <Modal>
    <TorrentContent
      v-if="metadata && metadataFiles"
      :key="metadata.infohash_v1 || metadata.hash"
      :files="metadataFiles"
      :title="metadata.info.name"
      :show-progress="false"
    >
      <template #actions>
        <button class="back" aria-label="Back to form" title="Back to form" @click="backToForm">
          <Icon :icon="icons.arrowLeft" />
        </button>
      </template>

      <template #bottom>
        <button class="flex-1" :disabled="disabled" @click="submit">Send</button>
      </template>
    </TorrentContent>

    <ModalContent v-else title="Add a torrent">
      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <FileSelect v-model:files="files" accept=".torrent" :autoselect="!hasPending" multiple />

        <h2>Category</h2>

        <label> <input :checked="!category" type="radio" name="category" value="" @change="category = ''"> None </label>

        <label v-for="cat in categories" :key="cat.name">
          <input
            :checked="category === cat.name"
            type="radio"
            name="category"
            :value="cat.name"
            @change="category = cat.name"
          >
          {{ cat.name }}
        </label>

        <label>
          <input v-model="sequentialDownload" type="checkbox">
          Sequential Download
        </label>

        <label v-if="hasSingleFile">
          <input v-model="selectPriorities" type="checkbox">
          Select priorities before creation
        </label>

        <button :disabled="disabled">Send</button>
      </form>
    </ModalContent>
  </Modal>
</template>

<style scoped>
.back {
  padding: 0.5rem 0.75rem;
  background-color: transparent;
  color: var(--secondary);
}
</style>
