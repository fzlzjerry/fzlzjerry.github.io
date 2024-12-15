import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === 'production' ? '/' : '/'),
  routes: [
    { 
      path: '/',
      name: 'HomePage',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/Home.vue'),
      meta: { section: 'about' }
    },
    {
      path: '/blog',
      name: 'BlogPage',
      component: () => import('@/views/Blog.vue'),
      children: [
        {
          path: ':article',
          name: 'BlogArticle',
          component: () => import('@/views/Blog.vue')
        }
      ]
    },
    // ...其他路由配置...
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.meta.section) {
      return {
        el: `#${to.meta.section}`,
        behavior: 'smooth'
      }
    }
    return savedPosition || { top: 0 }
  }
})

export default router
