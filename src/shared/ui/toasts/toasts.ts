import { shallowRef } from 'vue'

export type ToastType = 'success' | 'error'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

const toasts = shallowRef<Toast[]>([])

let toastId = 0

export const showToast = (message: string, type: ToastType = 'error') => {
  const id = String(++toastId)
  const toast: Toast = { id, message, type }

  toasts.value = [...toasts.value, toast]

  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, 5000)
}

export const useToasts = () => toasts
