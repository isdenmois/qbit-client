import { ref } from 'vue'

// Module-level ref so a file set on /search survives the /search -> /add route change.
// Lost on a hard reload of /add (in-memory only) — acceptable.
export const pendingFile = ref<File | null>(null)

export const setPendingFile = (file: File) => {
  pendingFile.value = file
}

export const clearPendingFile = () => {
  pendingFile.value = null
}
