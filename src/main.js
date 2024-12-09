import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { createHead } from '@vueuse/head'
import NotFound from './views/NotFound.vue'

// Import CSS dependencies
import 'bootstrap/dist/css/bootstrap.css'
import 'aos/dist/aos.css'
import '@fortawesome/fontawesome-free/css/all.css'

// Create router
const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === 'production' 
    ? '/'  // Change to root path
    : '/'),
  routes: [
    { 
      path: '/',
      name: 'HomePage',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('./views/Home.vue'),
      meta: { section: 'about' }
    },
    {
      path: '/skills',
      name: 'Skills',
      component: () => import('./views/Home.vue'),
      meta: { section: 'skills' }
    },
    {
      path: '/projects',
      name: 'Projects',
      component: () => import('./views/Home.vue'),
      meta: { section: 'projects' }
    },
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('./views/Home.vue'),
      meta: { section: 'contact' }
    },
    {
      path: '/testimonials',
      name: 'Testimonials',
      component: () => import('./views/Home.vue'),
      meta: { section: 'testimonials' }
    },
    {
      path: '/friends',
      name: 'Friends',
      component: () => import('./views/Home.vue'),
      meta: { section: 'friends' }
    },
    {
      path: '/blog',
      name: 'BlogPage',
      component: () => import('./views/Blog.vue'),
      children: [
        {
          path: ':article',
          name: 'BlogArticle',
          component: () => import('./views/Blog.vue')
        }
      ]
    },
    {
      path: '/igem',
      name: 'IgemPage',
      component: () => import('./views/iGEM.vue')
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

// Create and mount app
const app = createApp(App)
const head = createHead()

app.use(router)
app.use(head)
app.mount('#app')

// Import Bootstrap JS
import 'bootstrap'

