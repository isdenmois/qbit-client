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
  download: async (item: SearchResult) => {
    const filename = `${item.Title}.torrent`
    const blob = await wretch(item.Link).get().blob()

    return new File([blob], filename, { type: blob.type })
  },
}
