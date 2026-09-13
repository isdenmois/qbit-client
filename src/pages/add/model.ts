import { computed, onMounted, ref, watch } from 'vue'
import { guessCategory } from '@/entities/torrents'
import { clearPendingFile, pendingFile } from '@/features/search'
import { api } from '@/shared/api'
import { Priority, type TorrentFile, type TorrentMetadata } from '@/shared/api/torrent'
import { showToast } from '@/shared/ui'

const toTorrentFiles = (metadata: TorrentMetadata): TorrentFile[] =>
  metadata.info.files.map((file, index) => ({
    index,
    name: file.path,
    priority: Priority.Normal,
    progress: 0,
    size: file.length,
  }))

export const useAddTorrent = () => {
  const files = ref<FileList | null>(null)
  const category = ref('')
  const sequentialDownload = ref(true)
  const selectPriorities = ref(false)
  const metadata = ref<TorrentMetadata | null>(null)
  const metadataFiles = ref<TorrentFile[] | null>(null)

  const hasPending = Boolean(pendingFile.value)

  const disabled = computed(() => !files.value?.length)
  const hasSingleFile = computed(() => files.value?.length === 1)

  const clearMetadata = () => {
    metadata.value = null
    metadataFiles.value = null
  }

  const parseMetadata = async () => {
    const file = files.value?.[0]
    if (!file) return

    try {
      const [parsed] = await api.torrent.parseMetadata(file)

      // the user may have unchecked the box or swapped the file while parsing
      if (!parsed || !selectPriorities.value || files.value?.[0] !== file) return

      metadata.value = parsed
      metadataFiles.value = toTorrentFiles(parsed)
    } catch {
      if (!selectPriorities.value) return

      showToast('Failed to parse torrent metadata', 'error')
      selectPriorities.value = false
    }
  }

  watch(selectPriorities, (active) => {
    if (active) {
      void parseMetadata()
    } else {
      clearMetadata()
    }
  })

  watch(files, (newFiles) => {
    const filename = newFiles?.[0]?.name

    if (filename) {
      category.value = guessCategory(filename)
    }

    if (!selectPriorities.value) return

    // re-parse when the selected file changes, bail out when it is no longer a single file
    if (newFiles?.length === 1) {
      void parseMetadata()
    } else {
      selectPriorities.value = false
    }
  })

  onMounted(() => {
    if (pendingFile.value) {
      const dt = new DataTransfer()
      dt.items.add(pendingFile.value)
      files.value = dt.files
      clearPendingFile()
    }
  })

  const backToForm = () => {
    selectPriorities.value = false
  }

  const getFilePriorities = () => metadataFiles.value?.map((file) => file.priority).join(',')

  const getParsedUrl = () => metadata.value?.hash

  return {
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
  }
}
