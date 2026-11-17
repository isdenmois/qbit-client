import { app } from './app'
import { auth } from './auth'
import { jk } from './jk'
import { search } from './search'
import { sync } from './sync'
import { torrent } from './torrent'
import { transfer } from './transfer'

export const api = {
  auth,
  app,
  jk,
  search,
  sync,
  torrent,
  transfer,
}

export * from './app'
export * from './auth'
export * from './auth-state'
export type { SearchResult } from './jk'
export { jk } from './jk'
export type { SearchResults, SearchStarted } from './search'
export { search } from './search'
export * from './sync'
export * from './torrent'
export * from './transfer'
