import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import { createHead } from '@vueuse/head'
import NotFound from './views/NotFound.vue'

// Import CSS dependencies
import 'bootstrap/dist/css/bootstrap.css'
import 'aos/dist/aos.css'
import '@fortawesome/fontawesome-free/css/all.css'

// Create router
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { 
      path: '/',
      name: 'HomePage',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/blog',
      name: 'BlogPage',
      component: () => import('./views/Blog.vue')
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
    if (to.hash) {
      return {
        el: to.hash,
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

