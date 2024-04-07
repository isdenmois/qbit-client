import { updateMainData } from 'entities/stats'
import { api } from 'shared/api'

export const setDownloadLimit = async (limit: number) => {
  await api.transfer.setDownloadLimit(limit)

  updateMainData({
    server_state: {
      dl_rate_limit: limit,
    },
  })
}

export const setUploadLimit = async (limit: number) => {
  await api.transfer.setUploadLimit(limit)

  updateMainData({
    server_state: {
      up_rate_limit: limit,
    },
  })
}
