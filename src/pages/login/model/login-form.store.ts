import { computed, ref } from 'vue'
import { api } from '@/shared/api'

export const useLoginFormStore = () => {
  const username = ref('')
  const password = ref('')
  const submitting = ref(false)
  const hasError = ref(false)

  return {
    username,
    password,
    submitting,
    hasError,
    errorClass: computed(() => ({ error: hasError.value })),
    submitDisabled: computed(() => submitting.value || !username.value || !password.value),
    async submit() {
      submitting.value = true

      try {
        if (username.value && password.value) {
          await api.auth.login(username.value, password.value)
        }
      } catch {
        hasError.value = true
      } finally {
        submitting.value = false
      }
    },
  }
}
