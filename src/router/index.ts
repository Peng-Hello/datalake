import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/QueryBySqlView.vue')
    },
    {
      path: '/',
      name: 'data wrangler',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/DataWranglerDevView.vue')
    },

    {
      path: '/upload_files',
      name: 'upload file',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/UploadFileView.vue')
    },

    {
      path: '/query_by_conditions',
      name: 'query by conditions',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/QueryByConditionsView.vue')
    },

    {
      path: '/query_by_sql',
      name: 'query by SQL',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/QueryBySqlView.vue')
    },
    {
      path: '/job_manager',
      name: 'job Manager',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/JobManager.vue')
    }
  ]
})

export default router
