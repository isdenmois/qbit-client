<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { categories, guessCategory } from '@/entities/torrents'
import { clearPendingFile, pendingFile } from '@/features/search'
import { api } from '@/shared/api'
import { FileSelect, Modal, ModalContent, showToast } from '@/shared/ui'

const files = ref<FileList | null>(null)
const category = ref('')
const sequentialDownload = ref(true)

const hasPending = Boolean(pendingFile.value)

const disabled = computed(() => !files.value?.length)

watch(files, (newFiles) => {
  const filename = newFiles?.[0]?.name

  if (filename) {
    category.value = guessCategory(filename)
  }
})

const router = useRouter()

onMounted(() => {
  if (pendingFile.value) {
    const dt = new DataTransfer()
    dt.items.add(pendingFile.value)
    files.value = dt.files
    clearPendingFile()
  }
})

const submit = async () => {
  if (files.value?.length) {
    for (const file of [...files.value]) {
      const result = await api.torrent.add(file, category.value, sequentialDownload.value)

      if (!result) {
        return showToast(`Error on file ${file.name}`, 'error')
      }
    }

    router.replace('/')
  }
}
</script>

<template>
  <Modal>
    <ModalContent title="Add a torrent">
      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <FileSelect v-model:files="files" accept=".torrent" :autoselect="!hasPending" multiple />

        <h2>Category</h2>

        <label> <input :checked="!category" type="radio" name="category" value="" @change="category = ''"> None </label>

        <label v-for="cat in categories" :key="cat.id">
          <input
            :checked="category === cat.id"
            type="radio"
            name="category"
            :value="cat.id"
            @change="category = cat.id"
          >
          {{ cat.name }}
        </label>

        <label>
          <input v-model="sequentialDownload" type="checkbox">
          Sequential Download
        </label>

        <button :disabled="disabled">Send</button>
      </form>
    </ModalContent>
  </Modal>
</template>
