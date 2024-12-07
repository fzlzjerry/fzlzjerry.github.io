<template>
  <div class="igem">
    <div class="weekly-header">
      <h1>iGEM Weekly Reports</h1>
      <p>Click the cards to view detailed weekly reports</p>
    </div>
    <div class="cards-container">
      <div 
        v-for="week in weeklyReports" 
        :key="week.id"
        class="flip-card"
        :class="{ 'hover': week.isHovered }"
        @mouseover="week.isHovered = true"
        @mouseleave="week.isHovered = false"
        @click="navigateToReport(week.url)"
      >
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <h2>Week {{ week.id }}</h2>
            <div class="date">{{ week.date }}</div>
          </div>
          <div class="flip-card-back">
            <h3>{{ week.title }}</h3>
            <p>{{ week.description }}</p>
            <span class="view-more">Click to view more</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useHead } from '@vueuse/head'

export default {
  name: 'IgemPage',
  setup() {
    useHead({
      title: 'iGEM Weekly Reports - Synthetic Biology Research',
      meta: [
        { name: 'description', content: 'Weekly reports documenting progress and insights from iGEM synthetic biology research and competition preparation.' },
        { name: 'keywords', content: 'iGEM, Synthetic Biology, Research Reports, Weekly Updates, Biology Competition, Student Research' },
        { property: 'og:title', content: 'iGEM Weekly Reports - Synthetic Biology Research' },
        { property: 'og:description', content: 'Follow our journey in synthetic biology research and iGEM competition preparation through detailed weekly reports.' },
        { property: 'og:type', content: 'article' }
      ]
    })
  },
  data() {
    return {
      weeklyReports: [
        {
          id: 1,
          date: '2024-12-01',
          title: 'Week 1 Report',
          description: 'Added advisors to group chat and planning student recruitment for iGEM 2025.',
          url: './igem-weekly-report/2024-12-01/index.html',
          isHovered: false
        },
        {
          id: 2,
          date: '2024-12-07',
          title: 'Week 2 Report',
          description: 'Registered iGEM account, studied basic biology knowledge and competition rules.',
          url: './igem-weekly-report/2024-12-07/index.html',
          isHovered: false
        },
        // Add more weekly reports as needed
      ]
    }
  },
  methods: {
    navigateToReport(url) {
      // 使用 window.open 打开外部链接
      window.open(url, '_blank');
    }
  }
}
</script>

<style scoped>
.igem {
  min-height: 100vh;
  padding: 80px 20px 40px;
}

.weekly-header {
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-color);
}

.weekly-header h1 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.cards-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.flip-card {
  background-color: transparent;
  height: 200px;
  perspective: 1000px;
  cursor: pointer;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.flip-card.hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
}

.flip-card-front {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.flip-card-back {
  background-color: var(--accent-color);
  color: var(--text-color);
  transform: rotateY(180deg);
}

.flip-card h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.flip-card h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.date {
  font-size: 1rem;
  opacity: 0.9;
}

.view-more {
  position: absolute;
  bottom: 1rem;
  font-size: 0.9rem;
  color: var(--primary-color);
  font-weight: 500;
}

/* 添加悬停效果 */
.flip-card:hover {
  transform: translateY(-5px);
  transition: transform 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }

  .flip-card {
    height: 180px;
  }

  .flip-card h2 {
    font-size: 1.5rem;
  }

  .flip-card h3 {
    font-size: 1.2rem;
  }
}

/* 添加动画效果 */
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

.flip-card {
  animation: fadeIn 0.6s ease-out;
  animation-fill-mode: backwards;
}

.flip-card:nth-child(n) {
  animation-delay: calc(0.1s * n);
}
</style>

