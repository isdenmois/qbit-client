import { beforeEach, describe, expect, it, vi } from 'vitest'
import { maindata } from '@/entities/stats'
import { api } from '@/shared/api'
import type { MainData } from '@/shared/api/sync'
import { setDownloadLimit, setUploadLimit } from './update-limit'

describe('limit updates', () => {
  beforeEach(() => {
    maindata.value = { server_state: {} } as MainData
  })

  it('sets the download limit through the api and updates maindata', async () => {
    // arrange
    const setLimit = vi.spyOn(api.transfer, 'setDownloadLimit').mockResolvedValue('Ok.')

    // act
    await setDownloadLimit(1024)

    // assert
    expect(setLimit).toHaveBeenCalledWith(1024)
    expect(maindata.value?.server_state.dl_rate_limit).toBe(1024)
  })

  it('sets the upload limit through the api and updates maindata', async () => {
    // arrange
    const setLimit = vi.spyOn(api.transfer, 'setUploadLimit').mockResolvedValue('Ok.')

    // act
    await setUploadLimit(2048)

    // assert
    expect(setLimit).toHaveBeenCalledWith(2048)
    expect(maindata.value?.server_state.up_rate_limit).toBe(2048)
  })

  it('does not update maindata when setting the download limit fails', async () => {
    // arrange
    const error = new Error('network')
    vi.spyOn(api.transfer, 'setDownloadLimit').mockRejectedValue(error)

    // act
    const result = setDownloadLimit(1024)

    // assert
    await expect(result).rejects.toBe(error)
    expect(maindata.value?.server_state.dl_info_limit).not.toBeDefined()
  })

  it('does not update maindata when setting the upload limit fails', async () => {
    // arrange
    const error = new Error('network')
    vi.spyOn(api.transfer, 'setUploadLimit').mockRejectedValue(error)

    // act
    const result = setUploadLimit(2048)

    // assert
    await expect(result).rejects.toBe(error)
    expect(maindata.value?.server_state.up_rate_limit).not.toBeDefined()
  })
})
