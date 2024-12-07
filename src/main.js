import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router' // Changed import
import App from './App.vue'

// Import CSS dependencies
import 'bootstrap/dist/css/bootstrap.css'
import 'aos/dist/aos.css'
import '@fortawesome/fontawesome-free/css/all.css'

// Create router
const router = createRouter({
  history: createWebHashHistory(), // Changed to createWebHashHistory
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
app.use(router)
app.mount('#app')

// Import Bootstrap JS
import 'bootstrap'
