import type { Page } from '@playwright/test'
import { mockAppPreferences } from './app.mock'
import { mockLoggedIn, mockLoggedOut } from './auth.mock'
import { mockJkSearch } from './jk.mock'
import { maindataEmpty, maindataSeed, mockMaindata } from './maindata.mock'
import { mockQbSearch } from './search.mock'
import { mockTorrentActions, mockTorrentAdd, mockTorrentParseMetadata, sampleTorrentMetadata } from './torrents.mock'
import { mockTransferLimits } from './transfer.mock'

export const applyDefaultMocks = async (page: Page) => {
  await mockLoggedIn(page)
  await mockMaindata(page, maindataSeed())
  await mockTorrentActions(page)
  await mockTransferLimits(page)
  await mockAppPreferences(page)
  await mockTorrentAdd(page)
  await mockTorrentParseMetadata(page, [sampleTorrentMetadata])
  await mockJkSearch(page, [])
  await mockQbSearch(page, { status: 'Stopped', results: [], total: 0 })
}

export * from './app.mock'
export * from './auth.mock'
export * from './jk.mock'
export * from './maindata.mock'
export * from './search.mock'
export * from './torrents.mock'
export * from './transfer.mock'
export { maindataEmpty, maindataSeed, mockLoggedIn, mockLoggedOut, mockMaindata }
