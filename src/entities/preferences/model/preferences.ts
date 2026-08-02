import { ref } from 'vue'
import { api } from '@/shared/api'
import type { Preferences } from '@/shared/api/app'

export const preferences = ref<Preferences | null>(null)

export const loadPreferences = async () => {
  preferences.value = await api.app.preferences()
}

export const updatePreferences = async (patch: Partial<Preferences>) => {
  await api.app.setPreferences(patch)

  preferences.value = { ...(preferences.value ?? {}), ...patch } as Preferences
}
