<template>
  <div id="app">
    <!-- Add Turnstile Modal -->
    <div v-if="!isVerified" class="turnstile-modal">
      <div class="turnstile-content">
        <h2>Please Verify</h2>
        <p>Complete the verification to continue</p>
        <TurnstileWidget 
          :site-key="turnstileSiteKey"
          @turnstile-success="handleTurnstileSuccess"
        />
      </div>
    </div>

    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg fixed-top">
      <div class="container">
        <router-link class="navbar-brand" to="/">
          <img src="/favicon.ico" alt="Morax" style="height: 40px; border-radius: 8px;">
          Morax's Blog
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item"><router-link class="nav-link" to="/#about">About Me</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/#skills">Skills</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/#projects">Projects</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/#contact">Contact</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/blog">Blog</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/igem">iGEM</router-link></li>
            <li class="nav-item"><a class="nav-link" href="https://morax.blog/WeatherApp/" target="_blank">Weather</a></li>
            <li class="nav-item"><a class="nav-link" href="/rss.xml" target="_blank">RSS</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <router-view></router-view>

    <!-- Scroll to Top Button -->
    <button id="scrollTop" @click="scrollToTop" v-show="showScrollTop">
      <i class="fas fa-chevron-up"></i>
    </button>
  </div>
</template>

<script>
import TurnstileWidget from '@/components/TurnstileWidget.vue'
import { useHead } from '@vueuse/head'
import AOS from 'aos'  // Add this import

export default {
  name: 'App',
  components: {
    TurnstileWidget
  },
  setup() {
    useHead({
      titleTemplate: '%s | Morax\'s Blog',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'author', content: 'Morax Cheng' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:site_name', content: "Morax's Blog" },
        { property: 'og:locale', content: 'en_US' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:creator', content: '@moraxcheng' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://morax.blog' },
        { rel: 'alternate', type: 'application/rss+xml', title: "Morax's Blog RSS Feed", href: '/rss.xml' }
      ]
    })
  },
  data() {
    return {
      showScrollTop: false,
      turnstileSiteKey: '0x4AAAAAAA1t_hLCxNOO7BvT', // Replace with your actual site key
      isVerified: false
    }
  },
  watch: {
    isVerified(newVal) {
      // Toggle body overflow when verification status changes
      document.body.style.overflow = newVal ? '' : 'hidden';
    }
  },
  mounted() {
    // Check if user was previously verified
    this.isVerified = localStorage.getItem('turnstileVerified') === 'true';
    // Set initial body overflow
    document.body.style.overflow = this.isVerified ? '' : 'hidden';
    
    window.addEventListener('scroll', this.handleScroll);
    
    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: true
    });
  },
  beforeUnmount() {  // Changed from beforeDestroy to beforeUnmount
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    handleScroll() {
      this.showScrollTop = window.scrollY > 500;
    },
    // eslint-disable-next-line no-unused-vars
    handleTurnstileSuccess(token) {
      this.isVerified = true;
      localStorage.setItem('turnstileVerified', 'true');
    }
  }
}
</script>

<style>
:root {
  --primary-color: #C1A173;    /* 钟离主色调 - 金棕色 */
  --secondary-color: #8C7355;  /* 深棕色 */
  --accent-color: #F5E6D3;     /* 浅金色 */
  --text-color: #2C2C2C;       /* 深灰色文字 */
  --background-color: #FAF6F0; /* 米白色背景 */
  
  /* Animation Variables */
  --transition-speed: 0.3s;
  --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
  --animation-distance: 20px;
}

/* Reset and base styles */
body {
  margin: 0;
  font-family: 'Noto Serif', serif;
  background-color: var(--background-color);
  color: var(--text-color);
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Navigation styles */
.navbar {
  background-color: var(--primary-color);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-brand, .navbar-nav .nav-link {
  color: var(--background-color) !important;
  font-weight: 500;
  transition: color 0.3s;
}

.navbar-nav .nav-link:hover {
  color: var(--accent-color) !important;
}

/* Footer styles */
footer {
  background-color: var(--primary-color);
  color: var(--background-color);
  padding: 20px 0;
  text-align: center;
}

/* Scroll to top button */
#scrollTop {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: var(--primary-color);
  color: var(--background-color);
  border: none;
  border-radius: 50%;
  padding: 15px;
  font-size: 20px;
  cursor: pointer;
  z-index: 99;
  display: none;
  transition: background-color 0.3s;
}

#scrollTop:hover {
  background-color: var(--secondary-color);
}

/* Add responsiveness */
@media (max-width: 768px) {
  .navbar-brand {
    font-size: 1.1rem;
  }
  
  .container {
    padding: 0 15px;
  }
  
  .navbar {
    padding: 0.5rem;
  }

  .navbar-collapse {
    background: var(--primary-color);
    border-radius: 0 0 12px 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1rem;
  }

  .navbar-nav {
    gap: 0.5rem;
  }

  .navbar-nav .nav-link {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: all var(--transition-speed) var(--transition-timing);
  }

  .navbar-nav .nav-link:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

/* 全局过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-speed) var(--transition-timing),
              transform var(--transition-speed) var(--transition-timing);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(var(--animation-distance));
}

/* 优化滚动行为 */
html {
  scroll-behavior: smooth;
}

/* 优化触摸屏交互 */
@media (hover: hover) {
  .hover-effect {
    transition: transform var(--transition-speed) var(--transition-timing);
  }

  .hover-effect:hover {
    transform: translateY(-2px);
  }
}

@media (hover: none) {
  .hover-effect:active {
    transform: scale(0.98);
  }
}

/* Add Turnstile Modal Styles */
.turnstile-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.turnstile-content {
  background: var(--background-color);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.turnstile-content h2 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.turnstile-content p {
  color: var(--text-color);
  margin-bottom: 1.5rem;
}

/* Prevent scrolling when modal is open */
body.turnstile-active {
  overflow: hidden;
}
</style>
