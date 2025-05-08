import { http } from './client'

export interface SearchStarted {
  id: number // ID of the search job
}

export interface SearchResult {
  descrLink: string // URL of the torrent's description page
  fileName: string // Name of the file
  fileSize: number // Size of the file in Bytes
  fileUrl: string // Torrent download link (usually either .torrent file or magnet link)
  nbLeechers: number // Number of leechers
  nbSeeders: number // Number of seeders
}

export interface SearchResults {
  status: 'Running' | 'Stopped' // Current status of the search job
  results: SearchResult[]
  total: number // Total number of results
}

export const search = {
  start: (pattern: string, category = 'all', plugins = 'all') =>
    http.url('/search/start').formData({ pattern, category, plugins }).post().json<SearchStarted>(),
  results: (id: number, limit = 500, offset = 0) =>
    http.url('/search/results').query({ id, limit, offset }).get().json<SearchResults>(),
}
