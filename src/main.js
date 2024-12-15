import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // 引入路由配置
import { createHead } from '@vueuse/head'

// Import CSS dependencies
import 'bootstrap/dist/css/bootstrap.css'
import 'aos/dist/aos.css'
import '@fortawesome/fontawesome-free/css/all.css'

// Create and mount app
const app = createApp(App)
const head = createHead()

app.use(router)
app.use(head)
app.mount('#app')

// Import Bootstrap JS
import 'bootstrap'

