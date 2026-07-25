import { shallowRef } from 'vue'

export const pendingFile = shallowRef<File | null>(null)

export const setPendingFile = (file: File) => {
  pendingFile.value = file
}

export const clearPendingFile = () => {
  pendingFile.value = null
}
