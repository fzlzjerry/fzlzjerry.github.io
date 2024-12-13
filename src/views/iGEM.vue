<template>
  <div class="igem">
    <div class="weekly-header">
      <h1>iGEM Project Updates</h1>
      <p>Click the cards below to view our weekly reports and assignments</p>
    </div>
    <div class="tabs">
      <button 
        :class="{ active: activeTab === 'weekly' }" 
        @click="activeTab = 'weekly'">
        Weekly Reports
      </button>
      <button 
        :class="{ active: activeTab === 'assignments' }" 
        @click="activeTab = 'assignments'">
        iGEM Assignments
      </button>
    </div>
    <div class="cards-container" v-if="activeTab === 'weekly'">
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
            <div class="card-header">
              <span class="card-label">Week</span>
              <h2>{{ week.id }}</h2>
            </div>
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
    <div class="cards-container" v-else-if="activeTab === 'assignments'">
      <div 
        v-for="assignment in assignments" 
        :key="assignment.id"
        class="flip-card"
        :class="{ 'hover': assignment.isHovered }"
        @mouseover="assignment.isHovered = true"
        @mouseleave="assignment.isHovered = false"
        @click="navigateToReport(assignment.url)"
      >
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div class="card-header">
              <span class="card-label">Assignment</span>
              <h2>{{ assignment.id }}</h2>
            </div>
            <div class="date">{{ assignment.date }}</div>
          </div>
          <div class="flip-card-back">
            <h3>{{ assignment.title }}</h3>
            <p>{{ assignment.description }}</p>
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
      title: 'iGEM Project Updates - Weekly Reports & Assignments',
      meta: [
        { name: 'description', content: 'Track our iGEM journey through weekly reports and assignments. Comprehensive documentation of our synthetic biology research and competition preparation.' },
        { name: 'keywords', content: 'iGEM, Synthetic Biology, Research Reports, Weekly Updates, Biology Competition, Student Research, iGEM Assignments' },
        { property: 'og:title', content: 'iGEM Project Updates - Weekly Reports & Assignments' },
        { property: 'og:description', content: 'Explore our iGEM journey through detailed weekly reports and project assignments in synthetic biology research.' },
        { property: 'og:type', content: 'article' }
      ]
    })
  },
  data() {
    return {
      activeTab: 'weekly',
      weeklyReports: [
        {
          id: 1,
          date: '2024-12-01',
          title: 'Week 1 Report',
          description: 'Added advisors to group chat and planning student recruitment for iGEM 2025.',
          url: '/igem-weekly-report/2024-12-01/', // 移除 public 前缀
          isHovered: false
        },
        {
          id: 2,
          date: '2024-12-08',
          title: 'Week 2 Report',
          description: 'Registered iGEM account, studied basic biology knowledge and competition rules.',
          url: '/igem-weekly-report/2024-12-08/', // 移除 public 前缀
          isHovered: false
        },
        {
          id: 3,
          date: '2024-12-15',
          title: 'Week 3 Report',
          description: 'Completed iGEM rules report and began project topic research.',
          url: '/igem-weekly-report/2024-12-15/',
          isHovered: false
        }
      ],
      assignments: [
        {
          id: 1,
          date: '2024-12-15',
          title: 'Assignment 1',
          description: 'Details about Assignment 1.',
          url: '/igem-assignments/assignment1/', // 移除 public 前缀
          isHovered: false
        },
        // Add more assignments as needed
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
  padding: 120px 20px 40px; /* 增加顶部 padding 从 80px 到 120px */
}

.weekly-header {
  text-align: center;
  margin-bottom: 4rem; /* 增加底部 margin 从 3rem 到 4rem */
  color: var(--text-color);
}

.weekly-header h1 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.tabs button {
  background: none;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  color: var(--text-color);
  border-bottom: 2px solid transparent;
}

.tabs button.active {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.tabs button:hover {
  color: var(--primary-color);
}

.cards-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
  padding: 1.5rem;
}

.flip-card {
  background-color: transparent;
  height: 250px;
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
  padding: 2rem;
}

.card-header {
  text-align: center;
  margin-bottom: 1rem;
}

.card-label {
  display: block;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.flip-card h2 {
  font-size: 2.5rem;
  margin: 0;
  font-weight: 700;
}

.date {
  font-size: 1rem;
  opacity: 0.8;
  text-align: center;
}

.flip-card-back {
  background-color: var(--accent-color);
  color: var(--text-color);
  transform: rotateY(180deg);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.flip-card-back h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
  font-weight: 600;
}

.flip-card-back p {
  flex-grow: 1;
  margin: 1rem 0;
  line-height: 1.5;
}

.view-more {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  width: 100%;
}

/* 添加悬停效果 */
.flip-card:hover {
  transform: translateY(-5px);
  transition: transform 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .flip-card {
    height: 220px;
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

