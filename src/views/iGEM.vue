<template>
  <div class="igem">
    <div class="weekly-header">
      <h1>iGEM Project Updates</h1>
      <p>Click the cards below to view our weekly reports and assignments</p>
    </div>
    <div class="tabs">
      <button 
        :class="{ active: activeTab === 'weekly' }" 
        @click="updateTab('weekly')">
        Weekly Reports
      </button>
      <button 
        :class="{ active: activeTab === 'assignments' }" 
        @click="updateTab('assignments')">
        iGEM Assignments
      </button>
      <button
        :class="{ active: activeTab === 'experiments'}"
        @click="updateTab('experiments')">
        iGEM Experiments
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
    <div class="cards-container" v-else-if="activeTab === 'experiments'">
      <div 
        v-for="experiment in experiments" 
        :key="experiment.id"
        class="flip-card"
        :class="{ 'hover': experiment.isHovered }"
        @mouseover="experiment.isHovered = true"
        @mouseleave="experiment.isHovered = false"
        @click="navigateToReport(experiment.url)"
      >
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div class="card-header">
              <span class="card-label">Experiment</span>
              <h2>{{ experiment.id }}</h2>
            </div>
            <div class="date">{{ experiment.date }}</div>
          </div>
          <div class="flip-card-back">
            <h3>{{ experiment.title }}</h3>
            <p>{{ experiment.description }}</p>
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
        },
        {
          id: 4,
          date: '2024-12-22',
          title: 'Week 4 Report',
          description: 'Read the iGEM 2024 TOP 10 Project',
          url: '/igem-weekly-report/2024-12-22/',
          isHovered: false
        },
        {
          id: 5,
          date: '2024-12-29',
          title: 'Week 5 Report',
          description: 'Join the iGEM 2025 Simulation Camp',
          url: '/igem-weekly-report/2024-12-29/',
          isHovered: false
        },
        {
          id: 6,
          date: '2025-01-05',
          title: 'Week 6 Report',
          description: 'Work on the iGEM 2025 Wiki Website',
          url: '/igem-weekly-report/2025-01-05/',
          isHovered: false
        }
      ],
      assignments: [
        {
          id: 1,
          date: '2024-12-15',
          title: 'Assignment 1: iGEM Rules Report',
          description: 'A comprehensive overview of iGEM competition rules, required deliverables, and award structure for iGEM 2025.',
          url: '/igem-assignments/assignment1/',
          isHovered: false
        },
        // Add more assignments as needed
      ],
      experiments: [
        {
          id: 1,
          date: '2024-12-22',
          title: 'Experiment 1: Pipette Medium',
          description: 'Experimental Notes for Pipette Medium',
          url: '/igem-experiments/experiment1/',
          isHovered: false
        }
      ]
    }
  },
  created() {
    const tab = new URLSearchParams(window.location.search).get('tab');
    if (['weekly', 'assignments', 'experiments'].includes(tab)) {
      this.activeTab = tab;
    }
  },
  methods: {
    navigateToReport(url) {
      window.open(url, '_blank');
    },
    updateTab(tab) {
      this.activeTab = tab;
      const url = new URL(window.location);
      url.searchParams.set('tab', tab);
      window.history.pushState({}, '', url);
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
  height: 350px;
  perspective: 1000px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeIn 0.6s ease-out;
  animation-fill-mode: backwards;
  transform: translateZ(0);
}

.flip-card:hover {
  transform: translateY(-4px) translateZ(0);
  box-shadow: 0 12px 40px rgba(193, 161, 115, 0.2);
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  box-shadow: 0 8px 32px rgba(193, 161, 115, 0.15);
  border-radius: 16px;
  will-change: transform;
}

.flip-card.hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition: all 0.4s ease;
}

.flip-card-front {
  color: white;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
}

.flip-card-front::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, 
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.1) 50%,
    rgba(255,255,255,0) 100%
  );
  animation: shimmer 3s infinite;
  border-radius: 16px;
}

.card-header {
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;
}

.card-label {
  display: block;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0.8rem;
  opacity: 0.9;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.flip-card h2 {
  font-size: 3rem;
  margin: 0;
  font-weight: 700;
  background: linear-gradient(to right, #fff, rgba(255,255,255,0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.date {
  font-size: 1.1rem;
  opacity: 0.9;
  text-align: center;
  margin-top: 1rem;
  font-weight: 500;
  letter-spacing: 1px;
}

.flip-card-back {
  background: rgba(255, 255, 255, 0.95);
  color: var(--text-color);
  transform: rotateY(180deg);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 8px 32px rgba(193, 161, 115, 0.15);
  overflow-y: auto;
}

.flip-card-back h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
  font-weight: 600;
  position: relative;
  padding-bottom: 0.8rem;
  width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
}

.flip-card-back h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  border-radius: 2px;
}

.flip-card-back p {
  flex-grow: 1;
  margin: 1rem 0;
  line-height: 1.6;
  font-size: 1rem;
  color: var(--text-color);
  width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  padding-right: 0.5rem;
  overflow-y: visible;
}

.flip-card-back p::-webkit-scrollbar {
  width: 4px;
}

.flip-card-back p::-webkit-scrollbar-track {
  background: rgba(193, 161, 115, 0.1);
  border-radius: 2px;
}

.flip-card-back p::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 2px;
}

.view-more {
  text-align: center;
  padding-top: 0.8rem;
  margin-top: 0.8rem;
  border-top: 1px solid rgba(193, 161, 115, 0.2);
  width: 100%;
  font-weight: 500;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.view-more::after {
  content: '→';
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.flip-card-back:hover .view-more::after {
  opacity: 1;
  transform: translateX(0);
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
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

.flip-card:nth-child(n) {
  animation-delay: calc(0.1s * n);
}

@media (max-width: 768px) {
  .flip-card {
    height: 400px;
  }

  .flip-card h2 {
    font-size: 2.5rem;
  }

  .flip-card-back h3 {
    font-size: 1.2rem;
  }

  .flip-card-back p {
    font-size: 0.95rem;
  }
}
</style>

