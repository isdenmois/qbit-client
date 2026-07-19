import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('pages/home/home-page.vue'),
      children: [
        {
          path: 'limits',
          component: () => import('pages/limits/limits.page.vue'),
          meta: { modal: true },
        },
        {
          path: 'add',
          component: () => import('pages/add/add.page.vue'),
          meta: { modal: true },
        },
        {
          path: 'torrent/:id',
          component: () => import('pages/details/torrent-details.page.vue'),
          meta: { modal: true },
          children: [
            {
              path: '',
              component: () => import('pages/details/torrent-details-info.page.vue'),
            },
            {
              path: 'content',
              component: () => import('pages/details/torrent-content.page.vue'),
            },
            {
              path: 'category',
              component: () => import('pages/details/torrent-category.page.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/settings',
      component: () => import('pages/settings/settings-page.vue'),
    },
    {
      path: '/torrents',
      component: () => import('pages/torrents/torrents.page.vue'),
    },
    {
      path: '/search',
      component: () => import('pages/search/search-page.vue'),
    },
  ],
})
