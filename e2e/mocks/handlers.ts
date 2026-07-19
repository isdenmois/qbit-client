import type { Page } from '@playwright/test'
import { mockLoggedIn, mockLoggedOut } from './auth.mock'
import { mockJkSearch } from './jk.mock'
import { maindataEmpty, maindataSeed, mockMaindata } from './maindata.mock'
import { mockQbSearch } from './search.mock'
import { mockCategories, mockTorrentActions, mockTorrentAdd } from './torrents.mock'
import { mockTransferLimits } from './transfer.mock'

export const applyDefaultMocks = async (page: Page) => {
  await mockLoggedIn(page)
  await mockMaindata(page, maindataSeed())
  await mockCategories(page, {
    anime: { name: 'Anime', savePath: '/downloads/anime' },
    series: { name: 'Series', savePath: '/downloads/series' },
    games: { name: 'Games', savePath: '/downloads/games' },
  })
  await mockTorrentActions(page)
  await mockTransferLimits(page)
  await mockTorrentAdd(page, 'Ok.')
  await mockJkSearch(page, [])
  await mockQbSearch(page, { status: 'Stopped', results: [], total: 0 })
}

export * from './auth.mock'
export * from './jk.mock'
export * from './maindata.mock'
export * from './search.mock'
export * from './torrents.mock'
export * from './transfer.mock'
export { maindataEmpty, maindataSeed, mockLoggedIn, mockLoggedOut, mockMaindata }
