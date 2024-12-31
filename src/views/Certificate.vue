<template>
  <div class="certificate">
    <div class="certificate-header" data-aos="fade-down">
      <div class="header-content">
        <h1>Achievements & Honors</h1>
        <p>A collection of my academic and professional accomplishments</p>
      </div>
    </div>

    <div class="certificates-container">
      <div class="filter-bar" data-aos="fade-up">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search certificates..."
          >
        </div>
        <div class="filter-buttons">
          <button 
            v-for="type in certificateTypes" 
            :key="type"
            :class="['filter-btn', { active: selectedType === type }]"
            @click="selectedType = type"
          >
            {{ type }}
          </button>
        </div>
      </div>

      <div class="certificates-grid">
        <div 
          v-for="cert in filteredCertificates" 
          :key="cert.id"
          class="certificate-card"
          data-aos="fade-up"
          @click="showCertificateDetail(cert)"
        >
          <div class="card-image">
            <img :src="cert.thumbnail" :alt="cert.title">
            <div class="card-overlay">
              <span class="view-details">View Details</span>
            </div>
          </div>
          <div class="card-content">
            <span class="card-type">{{ cert.type }}</span>
            <h3 class="card-title">{{ cert.title }}</h3>
            <div class="card-info">
              <span class="award"><i class="fas fa-trophy"></i> {{ cert.award }}</span>
              <span class="date"><i class="fas fa-calendar"></i> {{ cert.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Certificate Detail Modal -->
    <div class="modal" v-if="selectedCertificate" @click.self="closeModal">
      <div class="modal-content" data-aos="zoom-in">
        <button class="close-button" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
        <div class="modal-grid">
          <div class="modal-image">
            <img :src="selectedCertificate.image" :alt="selectedCertificate.title">
          </div>
          <div class="modal-info">
            <span class="modal-type">{{ selectedCertificate.type }}</span>
            <h2>{{ selectedCertificate.title }}</h2>
            <p class="modal-description">{{ selectedCertificate.description }}</p>
            <div class="modal-metadata">
              <div class="metadata-item">
                <i class="fas fa-trophy"></i>
                <div>
                  <strong>Award</strong>
                  <span>{{ selectedCertificate.award }}</span>
                </div>
              </div>
              <div class="metadata-item">
                <i class="fas fa-building"></i>
                <div>
                  <strong>Organization</strong>
                  <span>{{ selectedCertificate.organization }}</span>
                </div>
              </div>
              <div class="metadata-item">
                <i class="fas fa-calendar"></i>
                <div>
                  <strong>Date</strong>
                  <span>{{ selectedCertificate.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useHead } from '@vueuse/head'

export default {
  name: 'CertificatePage',
  setup() {
    useHead({
      title: 'Certificates',
      meta: [
        {
          name: 'description',
          content: 'Explore Morax Cheng\'s academic and professional achievements, including awards, certifications, and honors from various competitions and organizations.'
        },
        {
          name: 'keywords',
          content: 'Morax Cheng, achievements, honors, certificates, awards, academic accomplishments, NEC, National Economics Challenge'
        },
        {
          property: 'og:title',
          content: 'Achievements & Honors | Morax Cheng'
        },
        {
          property: 'og:description',
          content: 'Explore Morax Cheng\'s academic and professional achievements, including awards, certifications, and honors from various competitions and organizations.'
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          name: 'twitter:title',
          content: 'Achievements & Honors | Morax Cheng'
        },
        {
          name: 'twitter:description',
          content: 'Explore Morax Cheng\'s academic and professional achievements, including awards, certifications, and honors from various competitions and organizations.'
        }
      ]
    })
  },
  data() {
    return {
      selectedCertificate: null,
      searchQuery: '',
      selectedType: 'All',
      certificates: [
        {
          id: 1,
          type: 'Competition',
          title: 'NEC Preliminary Level 2025',
          description: 'Awarded the Regional Overall Team Silver Award in the Pre Division (Entry-Level Division) of the National Economics Challenge (NEC) 2025, demonstrating excellence in economic knowledge and analytical skills.',
          award: 'Regional Overall Team Silver Award',
          organization: 'Council for Economic Education',
          date: 'December 2024',
          thumbnail: '/certificates/CNEC2025初级站荣誉证书1.jpg',
          image: '/certificates/CNEC2025初级站荣誉证书1.jpg'
        },
        {
          id: 2,
          type: 'Competition',
          title: 'NEC Preliminary Level 2025',
          description: 'Achieved the National Top Scoring Individual Gold Award in the Pre Division (Entry-Level Division) of the National Economics Challenge (NEC) 2025, representing BASIS International School Park Lane Harbour.',
          award: 'National Top Scoring Individual Gold Award',
          organization: 'Council for Economic Education',
          date: 'December 2024',
          thumbnail: '/certificates/CNEC2025初级站荣誉证书2.jpg',
          image: '/certificates/CNEC2025初级站荣誉证书2.jpg'
        },
        {
          id: 3,
          type: 'Competition',
          title: 'NEC Preliminary Level 2025',
          description: 'Inducted into the Macroeconomics Hall of Fame in the Pre Division (Entry-Level Division) of the National Economics Challenge (NEC) 2025, recognizing outstanding performance in macroeconomic analysis and understanding.',
          award: 'Macroeconomics Hall of Fame',
          organization: 'Council for Economic Education',
          date: 'December 2024',
          thumbnail: '/certificates/CNEC2025初级站荣誉证书3.jpg',
          image: '/certificates/CNEC2025初级站荣誉证书3.jpg'
        }
      ]
    }
  },
  computed: {
    certificateTypes() {
      const types = ['All', ...new Set(this.certificates.map(cert => cert.type))];
      return types;
    },
    filteredCertificates() {
      return this.certificates.filter(cert => {
        const matchesSearch = cert.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            cert.description.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesType = this.selectedType === 'All' || cert.type === this.selectedType;
        return matchesSearch && matchesType;
      });
    }
  },
  methods: {
    showCertificateDetail(cert) {
      this.selectedCertificate = cert;
      document.body.style.overflow = 'hidden';
    },
    closeModal() {
      this.selectedCertificate = null;
      document.body.style.overflow = '';
    }
  }
}
</script>

<style scoped>
.certificate {
  min-height: 100vh;
  background-color: var(--background-color);
}

.certificate-header {
  position: relative;
  height: 400px;
  background: linear-gradient(rgba(193, 161, 115, 0.8), rgba(140, 115, 85, 0.8));
  color: white;
  overflow: hidden;
}

.certificate-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(rgba(193, 161, 115, 0.8), rgba(140, 115, 85, 0.8));
  opacity: 0.1;
}

.header-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
}

.header-content h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.header-content p {
  font-size: 1.4rem;
  opacity: 0.9;
  max-width: 600px;
}

.certificates-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-box input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-color);
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.6rem 1.2rem;
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  background: transparent;
  color: var(--primary-color);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover, .filter-btn.active {
  background: var(--primary-color);
  color: white;
}

.certificates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
  margin-top: 2rem;
}

.certificate-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 
    0 4px 20px rgba(193, 161, 115, 0.1),
    0 0 0 1px rgba(193, 161, 115, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
}

.certificate-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 12px 30px rgba(193, 161, 115, 0.2),
    0 0 0 1px rgba(193, 161, 115, 0.15);
}

.card-image {
  position: relative;
  height: 220px;
  overflow: hidden;
  border-bottom: 1px solid rgba(193, 161, 115, 0.1);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.certificate-card:hover .card-image img {
  transform: scale(1.08);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(193, 161, 115, 0.1),
    rgba(140, 115, 85, 0.4)
  );
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.certificate-card:hover .card-overlay {
  opacity: 1;
}

.view-details {
  color: white;
  font-weight: 600;
  padding: 1rem 2rem;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 30px;
  backdrop-filter: blur(4px);
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.certificate-card:hover .view-details {
  transform: translateY(0);
  opacity: 1;
}

.card-content {
  padding: 1.8rem;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 1)
  );
}

.card-type {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  background: rgba(193, 161, 115, 0.1);
  color: rgb(193, 161, 115);
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  border: 1px solid rgba(193, 161, 115, 0.2);
}

.card-title {
  font-size: 1.3rem;
  color: #2c2520;
  margin-bottom: 1.2rem;
  line-height: 1.4;
  font-weight: 600;
}

.card-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
  font-size: 0.95rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(193, 161, 115, 0.1);
}

.card-info i {
  margin-right: 0.5rem;
  color: rgb(193, 161, 115);
}

.award, .date {
  display: flex;
  align-items: center;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.modal-image {
  padding: 2rem;
}

.modal-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.modal-info {
  padding: 2rem 2rem 2rem 0;
}

.modal-type {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  background: var(--accent-color);
  color: var(--primary-color);
  border-radius: 20px;
  font-weight: 500;
  margin-bottom: 1rem;
}

.modal-info h2 {
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  line-height: 1.3;
}

.modal-description {
  color: var(--text-color);
  opacity: 0.8;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.modal-metadata {
  display: grid;
  gap: 1.5rem;
}

.metadata-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.metadata-item i {
  font-size: 1.5rem;
  color: var(--primary-color);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-color);
  border-radius: 50%;
}

.metadata-item div {
  display: flex;
  flex-direction: column;
}

.metadata-item strong {
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.6;
  margin-bottom: 0.2rem;
}

.metadata-item span {
  color: var(--text-color);
  font-weight: 500;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.close-button:hover {
  transform: rotate(90deg);
  background: var(--primary-color);
  color: white;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .modal-grid {
    grid-template-columns: 1fr;
  }

  .modal-info {
    padding: 0 2rem 2rem;
  }
}

@media (max-width: 768px) {
  .certificate-header {
    height: 300px;
  }

  .header-content h1 {
    font-size: 2.5rem;
  }

  .header-content p {
    font-size: 1.1rem;
  }

  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: none;
  }

  .certificates-container {
    padding: 2rem 1rem;
  }

  .modal {
    padding: 1rem;
  }

  .modal-content {
    max-height: 95vh;
  }

  .certificates-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .card-image {
    height: 180px;
  }

  .card-content {
    padding: 1.4rem;
  }

  .card-title {
    font-size: 1.2rem;
  }

  .card-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }
}

@media (max-width: 480px) {
  .header-content h1 {
    font-size: 2rem;
  }

  .card-image {
    height: 160px;
  }

  .metadata-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .certificate-card {
    background: #2d2d2d;
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(193, 161, 115, 0.2);
  }

  .card-content {
    background: linear-gradient(
      to bottom,
      rgba(45, 45, 45, 0.8),
      rgba(45, 45, 45, 1)
    );
  }

  .card-title {
    color: #e0e0e0;
  }

  .card-info {
    color: #999;
    border-top-color: rgba(193, 161, 115, 0.2);
  }

  .certificate-card:hover {
    box-shadow: 
      0 12px 30px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(193, 161, 115, 0.3);
  }
}
</style> 