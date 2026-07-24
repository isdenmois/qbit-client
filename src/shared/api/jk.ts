import wretch from 'wretch'
import QueryStringAddon from 'wretch/addons/queryString'

const http = wretch(import.meta.env.VITE_JK_URL).addon(QueryStringAddon)

interface SearchResponse {
  Results: SearchResult[]
}

export interface SearchResult {
  Guid: string
  Details: string
  Title: string
  Link: string
  Seeders: number
  Peers: number
  PublishDate: string
  Size: number
  Tracker: string
}

export const jk = {
  search: (query: string) => http.query({ Query: query }).get().json<SearchResponse>(),
}

export const downloadTorrent = async (link: string, filename: string) => {
  const res = await fetch(link)
  if (!res.ok) throw new Error(`Download failed: ${res.status}`)

  const blob = await res.blob()
  return new File([blob], filename, { type: 'application/x-bittorrent' })
}
