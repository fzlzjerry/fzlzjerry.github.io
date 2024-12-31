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
      path: '/skills',
      name: 'Skills',
      component: () => import('@/views/Home.vue'),
      meta: { section: 'skills' }
    },
    {
      path: '/projects',
      name: 'Projects',
      component: () => import('@/views/Home.vue'),
      meta: { section: 'projects' }
    },
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('@/views/Home.vue'),
      meta: { section: 'contact' }
    },
    {
      path: '/testimonials',
      name: 'Testimonials',
      component: () => import('@/views/Home.vue'),
      meta: { section: 'testimonials' }
    },
    {
      path: '/friends',
      name: 'Friends',
      component: () => import('@/views/Home.vue'),
      meta: { section: 'friends' }
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
    {
      path: '/igem',
      name: 'IgemPage',
      component: () => import('@/views/iGEM.vue')
    },
    {
      path: '/certificate',
      name: 'CertificatePage',
      component: () => import('@/views/Certificate.vue')
    },
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
