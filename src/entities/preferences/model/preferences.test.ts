import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/shared/api'
import type { Preferences } from '@/shared/api/app'
import { loadPreferences, preferences, updatePreferences } from './preferences'

const basePreferences: Preferences = {
  max_active_downloads: 4,
  max_ratio: 3,
  max_uploads_per_torrent: 10,
}

describe('preferences store', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    preferences.value = null
  })

  describe('loadPreferences', () => {
    it('populates the store from the api', async () => {
      // arrange
      vi.spyOn(api.app, 'preferences').mockResolvedValue(basePreferences)

      // act
      await loadPreferences()

      // assert
      expect(api.app.preferences).toHaveBeenCalledOnce()
      expect(preferences.value).toEqual(basePreferences)
    })

    it('propagates api errors', async () => {
      // arrange
      const error = new Error('network')
      vi.spyOn(api.app, 'preferences').mockRejectedValue(error)

      // act / assert
      await expect(loadPreferences()).rejects.toThrow('network')
      expect(preferences.value).toBeNull()
    })
  })

  describe('updatePreferences', () => {
    it('persists the patch via the api', async () => {
      // arrange
      vi.spyOn(api.app, 'setPreferences').mockResolvedValue('Ok.')

      // act
      await updatePreferences({ max_ratio: 5 })

      // assert
      expect(api.app.setPreferences).toHaveBeenCalledWith({ max_ratio: 5 })
    })

    it('merges the patch into the existing store', async () => {
      // arrange
      preferences.value = { ...basePreferences }
      vi.spyOn(api.app, 'setPreferences').mockResolvedValue('Ok.')

      // act
      await updatePreferences({ max_ratio: 5, max_active_downloads: 8 })

      // assert
      expect(preferences.value).toEqual({
        max_active_downloads: 8,
        max_ratio: 5,
        max_uploads_per_torrent: 10,
      })
    })

    it('builds the store from the patch when empty', async () => {
      // arrange
      vi.spyOn(api.app, 'setPreferences').mockResolvedValue('Ok.')

      // act
      await updatePreferences({ max_uploads_per_torrent: 2 })

      // assert
      expect(preferences.value).toEqual({ max_uploads_per_torrent: 2 })
    })

    it('propagates api errors without touching the store', async () => {
      // arrange
      preferences.value = { ...basePreferences }
      vi.spyOn(api.app, 'setPreferences').mockRejectedValue(new Error('network'))

      // act / assert
      await expect(updatePreferences({ max_ratio: 5 })).rejects.toThrow('network')
      expect(preferences.value).toEqual(basePreferences)
    })
  })
})
