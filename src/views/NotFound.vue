<template>
  <div class="not-found">
    <img src="@/assets/404.png" alt="404 Image" class="not-found-image" />
    <p class="error-message">Looks like you've found a page that doesn't exist!</p>
    <p class="sub-message">Don't worry, sometimes even we get lost.</p>
    <router-link to="/" class="home-button">
      <span>← Return to Homepage</span>
    </router-link>
  </div>
</template>

<script>
import { useHead } from '@vueuse/head'

export default {
  name: 'NotFound',
  setup() {
    useHead({
      title: '404 - Page Not Found',
      meta: [
        { name: 'description', content: 'The requested page could not be found on Morax\'s Blog.' },
        { name: 'robots', content: 'noindex, nofollow' }
      ]
    })
  }
}
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: var(--background-color);
  color: var(--text-color);
  animation: fadeIn 1s ease-in-out;
  padding: 2rem;
}

.not-found-image {
  width: min(300px, 80vw);
  height: auto;
  margin-bottom: 3rem;
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1));
}

.error-message {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.sub-message {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: var(--text-secondary-color);
}

.home-button {
  font-size: 1.1rem;
  color: var(--primary-color);
  text-decoration: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  background-color: transparent;
  border: 2px solid var(--primary-color);
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.home-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  background-color: var(--primary-color);
  color: var(--background-color);
}

.home-button:active {
  transform: translateY(0);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .error-message {
    font-size: 1.5rem;
  }
  
  .sub-message {
    font-size: 1rem;
  }
  
  .home-button {
    font-size: 1rem;
    padding: 0.6rem 1.2rem;
  }
}
</style>