import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/pages/home'),
      children: [
        {
          path: 'limits',
          component: () => import('@/pages/limits'),
          meta: { modal: true },
        },
        {
          path: 'add',
          component: () => import('@/pages/add'),
          meta: { modal: true },
        },
        {
          path: 'torrent/:id',
          component: () => import('@/pages/torrent-details'),
          meta: { modal: true },
          children: [
            {
              path: '',
              component: () => import('@/pages/torrent-details').then((m) => m.TorrentDetailsInfoPage),
            },
            {
              path: 'content',
              component: () => import('@/pages/torrent-content'),
            },
            {
              path: 'category',
              component: () => import('@/pages/torrent-category'),
            },
          ],
        },
      ],
    },
    {
      path: '/settings',
      component: () => import('@/pages/settings'),
      children: [
        {
          path: 'categories',
          component: () => import('@/pages/settings-categories'),
          meta: { modal: true },
        },
        {
          path: 'advanced',
          component: () => import('@/pages/settings-advanced'),
          meta: { modal: true },
        },
      ],
    },
    {
      path: '/torrents',
      redirect: '/',
    },
    {
      path: '/search',
      component: () => import('@/pages/search'),
    },
  ],
})
