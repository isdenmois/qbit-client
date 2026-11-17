import { updatePreferences } from '@/entities/preferences'

export const setMaxActiveDownloads = async (maxActiveDownloads: number) => {
  await updatePreferences({ max_active_downloads: maxActiveDownloads })
}

export const setMaxRatio = async (maxRatio: number) => {
  await updatePreferences({ max_ratio: maxRatio })
}
