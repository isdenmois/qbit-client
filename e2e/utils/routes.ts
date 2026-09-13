export const routes = {
  home: '/',
  login: '/',
  search: '/search',
  settings: '/settings',
  limits: '/limits',
  add: '/add',
  torrentDetails: (id: string) => `/torrent/${id}`,
  torrentContent: (id: string) => `/torrent/${id}/content`,
  torrentCategory: (id: string) => `/torrent/${id}/category`,
}
