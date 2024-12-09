<template>
  <div class="home">
    <!-- Header Section -->
    <header class="text-center">
      <div class="container">
        <h1 data-aos="fade-up">Welcome to Morax's Blog</h1>
        <h3 data-aos="fade-up">
          <span id="typed"></span>
        </h3>
        <div class="social-links mt-4" data-aos="fade-up">
          <a href="https://x.com/moraxcheng" target="_blank" class="social-icon">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="https://fb.com/moraxcheng" target="_blank" class="social-icon">
            <i class="fab fa-facebook"></i>
          </a>
          <a href="https://instagram.com/moraxcheng" target="_blank" class="social-icon">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="https://discord.gg/F2BbkNfh" target="_blank" class="social-icon">
            <i class="fab fa-discord"></i>
          </a>
          <a href="#" class="social-icon" @click.prevent="handleEmailClick">
            <i class="fas fa-envelope"></i>
          </a>
        </div>
      </div>
    </header>

    <!-- About Section -->
<section id="about" data-aos="fade-up">
    <div class="container" data-aos="fade-up">
        <h2 class="text-center">About Me</h2>
        <p>Hello! I'm Morax Cheng, a teenage open-source enthusiast and developer based in China. I have a strong passion for coding, mathematics, and artificial intelligence. I love to explore new technologies and apply them to solve real-world problems. When I'm not coding, you can find me reading sci-fi novels or playing chess.</p>
        <p>🔭 I'm currently working on <a href="https://github.com/fzlzjerry/graphing_calculator" target="_blank">Graphing Calculator</a></p>
        <p>🌱 I'm currently learning <strong>Matlab</strong> and diving deeper into machine learning algorithms.</p>
        <p>👯 I’m looking to collaborate on <a href="https://github.com/lanbinshijie/bili2text" target="_blank">bili2text</a> and other exciting open-source projects.</p>
        <p>💬 Ask me about <strong>Python, C++, Machine Learning, and Data Analysis</strong></p>
    </div>
</section>

<!-- Skills Section -->
<section id="skills" data-aos="fade-up">
  <div class="container">
    <h2 class="text-center" data-aos="fade-up">Languages and Tools</h2>
    <div class="skills-grid">
      <div
        class="skill-item"
        v-for="skill in skills"
        :key="skill.name"
        data-aos="fade-up"
      >
        <a :href="skill.link" target="_blank">
          <img :src="skill.imgSrc" :alt="skill.name">
          <p>{{ skill.name }}</p>
        </a>
      </div>
    </div>
  </div>
</section>

<!-- Projects Section -->
<section id="projects" data-aos="fade-up">
    <div class="container">
        <h2 class="text-center" data-aos="fade-up">Projects</h2>
        <div class="row">
            <!-- Project 1 -->
            <div class="col-md-6" data-aos="fade-up">
                <div class="project-item">
                    <h4><a href="https://github.com/fzlzjerry/graphing_calculator" target="_blank">Graphing Calculator</a></h4>
                    <p>A powerful tool for plotting mathematical functions with a user-friendly interface.</p>
                </div>
            </div>
            <!-- Project 2 -->
            <div class="col-md-6" data-aos="fade-up">
                <div class="project-item">
                    <h4><a href="https://github.com/lanbinshijie/bili2text" target="_blank">bili2text</a></h4>
                    <p>Collaborative project for text extraction from Bilibili videos, enhancing accessibility.</p>
                </div>
            </div>
            <!-- Add more projects if needed -->
        </div>
    </div>
</section>

<!-- Testimonials Section -->
<section id="testimonials" data-aos="fade-up">
    <div class="container" data-aos="fade-up">
        <h2 class="text-center">Testimonials</h2>
        <!-- Testimonials Carousel -->
        <div id="testimonialCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <div class="testimonial-content">
                        <p>"Morax is a highly skilled developer with a keen eye for detail."</p>
                        <h5>- Alex Huang</h5>
                    </div>
                </div>
                <div class="carousel-item">
                    <div class="testimonial-content">
                        <p>"Morax consistently delivers high-quality work and is a pleasure to collaborate with."</p>
                        <h5>- Benjamin Dai</h5>
                    </div>
                </div>
                <div class="carousel-item">
                    <div class="testimonial-content">
                        <p>"His problem-solving abilities are exceptional and greatly benefit our projects."</p>
                        <h5>- Georhan Wen</h5>
                    </div>
                </div>
            </div>
            <!-- Add carousel controls -->
            <button class="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon"></span>
            </button>
            <!-- Add carousel indicators -->
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="0" class="active"></button>
                <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="1"></button>
                <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="2"></button>
            </div>
        </div>
    </div>
</section>

<!-- Friends Section -->
<section id="friends" data-aos="fade-up">
  <div class="container">
    <h2 class="text-center mb-5">Friends</h2>
    <div class="friends-grid">
      <div v-for="friend in friends" :key="friend.name">
        <div class="friend-card">
          <div class="friend-card-content">
            <img :src="friend.avatar" 
                 :alt="friend.name" 
                 class="friend-avatar"
                 loading="lazy">
            <h3 class="friend-name">{{ friend.name }}</h3>
            <p class="friend-description">{{ friend.description }}</p>
          </div>
          <a :href="friend.url" class="friend-link" target="_blank" rel="noopener noreferrer">
            Visit <i class="fas fa-external-link-alt"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Contact Section -->
<section id="contact" data-aos="fade-up">
    <div class="container text-center" data-aos="fade-up">
        <h2>Contact Me</h2>
        <p>I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions. Feel free to reach out!</p>
        <p>Email: <a href="#" @click.prevent="handleEmailClick">james20081204@gmail.com</a></p>
    </div>
</section>

<!-- Blog Section -->
<div class="markdown-content">
    <!-- Container where markdown content will be rendered -->
    <div id="blog-post">
        <!-- ...existing code... -->
    </div>
</div>

<!-- Keep only one footer -->
<footer>
    <p>
        &copy; 2024 Morax Cheng. All rights reserved.
        <br>
        <img src="https://beian.miit.cn.com/logo.svg" alt="MIIT" width="20">
        <a target="_blank" href="https://beian.miit.cn.com/gov/search.php?query=morax.blog" title="MIIT备20241269号" style="color: white;">MIIT备20241269号</a>
        <img src="https://icp.gov.moe/images/ico64.png" alt="萌国ICP备案" width="20">
        <a target="_blank" href="https://icp.gov.moe/?keyword=morax.blog" title="萌ICP备20243112号" style="color: white;">萌ICP备20243112号</a>
        <a href="https://icp.gs/?id=20242988" title="岸号:20242988号" style="color: white;"><img src="https://icp.gs/assets/images/icp.png" alt="岸号:" width="20">岸号:20242988号</a>
        <a href="https://icp.n3v.cn/beian/ICP-2024120177.html" title="易AIA盟2024120177号" target="_blank" style="color: white"><img style="width:20px;height:20px;" src="https://icp.n3v.cn/static/picture/icplogoi.png">易AIA盟2024120177号</a>
    </p>
</footer>
  </div>

  <!-- 自定义对话框组件 -->
  <div class="custom-dialog" v-if="showDialog" @click.self="closeDialog">
    <div class="dialog-content" data-aos="fade-up">
      <div class="dialog-header">
        <h3><i class="fas fa-envelope"></i> Contact Options</h3>
        <button class="close-button" @click="closeDialog">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="dialog-body">
        <p class="success-message">
          <i class="fas fa-check-circle"></i> Email address copied to clipboard!
        </p>
        <div class="options-list">
          <h4>You can send emails via:</h4>
          <div class="option-item">
            <i class="fas fa-copy"></i>
            <span>Using copied address: {{ email }}</span>
          </div>
          <div class="option-item">
            <i class="fab fa-google"></i>
            <a href="https://gmail.com" target="_blank" rel="noopener">Open in Gmail</a>
          </div>
          <div class="option-item">
            <i class="fab fa-microsoft"></i>
            <a href="https://outlook.live.com" target="_blank" rel="noopener">Open in Outlook</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Typed from 'typed.js'
import { Carousel } from 'bootstrap' // 添加这行导入
import { useHead } from '@vueuse/head'

export default {
  name: 'HomePage', // Updated to a multi-word name
  setup() {
    useHead({
      title: "Home - Morax's Blog",
      meta: [
        { name: 'description', content: 'Personal website of Morax Cheng, a teenage open-source enthusiast and developer from China. Featuring projects in Python, Machine Learning, and Data Analysis.' },
        { name: 'keywords', content: 'Morax Cheng, Developer, Open Source, Python, Machine Learning, AI, Data Analysis, Teenage Developer, China' },
        { property: 'og:title', content: "Morax's Blog - Open Source Developer & AI Enthusiast" },
        { property: 'og:description', content: 'Personal website of Morax Cheng, featuring projects and insights in software development and AI.' },
        { property: 'og:type', content: 'website' }
      ]
    })
  },
  data() {
    return {
      friends: [
        {
          name: "OpenTeens",
          url: "https://openteens.org",
          avatar: "https://openteens.org/img/logo/build/circle.png",
          description: "An open source community for teenagers"
        },
        {
          name: "BuckDuck",
          url: "https://bugduck.org",
          avatar: "https://bugduck.org/assets/logo-D9SokDiu.png",
          description: "A Open-Source Team to Concentrate on Better Codes"
        },
        {
          name: "Dramara",
          url: "https://dromara.org",
          avatar: "https://dromara.org/logo.svg",
          description: "One person may be able to go faster, but a group of people will go further."
        },
        {
          name: "AcboxSky",
          url: "https://index.acbox.lol",
          avatar: "https://pbs.twimg.com/profile_images/1814737217748934658/d6ehQOjC_400x400.jpg",
          description: "💻OSS Developer,🎸Music Lover,🌈Dreamer,🌍Desiring for Freedom"
        },
        {
          name: "Culiu Tech",
          url: "https://culiu-tech.com",
          avatar: "https://static.wixstatic.com/media/f59b07_ab8a29a135e24d4bac6a28f829aba6a0~mv2.png/v1/fill/w_160,h_160,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/50401683122148__pic.png",
          description: "We believe that education is a journey, not just a destination."
        },
        {
          name: "Nathan Chen",
          url: "https://nathanchen.me",
          avatar: "https://nathanchen.me/img/icon.png",
          description: "A high-school developer and designer who loves to create and share."
        }
      ],
      skills: [
        // Programming Languages
        {
          name: "C",
          link: "https://www.open-std.org/jtc1/sc22/wg14/",
          imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/c/c-original.svg",
        },
        {
          name: "C++",
          link: "https://isocpp.org/",
          imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg",
        },
        {
          name: "JavaScript",
          link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
          imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg",
        },
        {
          name: "Python",
          link: "https://www.python.org/",
          imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg",
        },

        // Web Technologies
        {
          name: "CSS3",
          link: "https://www.w3schools.com/css/",
          imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg",
        },
        {
          name: "HTML5",
          link: "https://www.w3.org/html/",
          imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg",
        },
        {
          name: "Node.js",
          link: "https://nodejs.org/",
          imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg",
        },
        {
          name: "React",
          link: "https://reactjs.org/",
          imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg",
        },
        {
          name: "Vue",
          link: "https://vuejs.org/",
          imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original-wordmark.svg",
        },

        // AI/ML & Data Science
        {
          name: "NumPy",
          link: "https://numpy.org/",
          imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/numpy/numpy-original.svg",
        },
        {
          name: "OpenCV",
          link: "https://opencv.org/",
          imgSrc: "https://www.vectorlogo.zone/logos/opencv/opencv-icon.svg",
        },
        {
          name: "Pandas",
          link: "https://pandas.pydata.org/",
          imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/pandas/pandas-original.svg",
        },
        {
          name: "PyTorch",
          link: "https://pytorch.org/",
          imgSrc: "https://www.vectorlogo.zone/logos/pytorch/pytorch-icon.svg",
        },
        {
          name: "Scikit-learn",
          link: "https://scikit-learn.org/",
          imgSrc: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg",
        },
        {
          name: "SciPy",
          link: "https://scipy.org/",
          imgSrc: "https://upload.wikimedia.org/wikipedia/commons/b/b2/SCIPY_2.svg",
        },
        {
          name: "TensorFlow",
          link: "https://www.tensorflow.org/",
          imgSrc: "https://www.vectorlogo.zone/logos/tensorflow/tensorflow-icon.svg",
        },

        // Cloud Platforms
        {
          name: "Google Cloud",
          link: "https://cloud.google.com",
          imgSrc: "https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg"
        },
        {
          name: "AWS",
          link: "https://aws.amazon.com/",
          imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg"
        },
        {
          name: "Azure",
          link: "https://azure.microsoft.com/",
          imgSrc: "https://www.vectorlogo.zone/logos/microsoft_azure/microsoft_azure-icon.svg",
        },

        // Development Tools
        {
          name: "Docker",
          link: "https://www.docker.com/",
          imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg",
        },
        {
          name: "Git",
          link: "https://git-scm.com/",
          imgSrc: "https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg",
        },
        {
          name: "Linux",
          link: "https://www.linux.org/",
          imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg",
        },
        {
          name: "Matlab",
          link: "https://www.mathworks.com/products/matlab.html",
          imgSrc: "https://upload.wikimedia.org/wikipedia/commons/2/21/Matlab_Logo.png",
        },
        {
          name: "MySQL",
          link: "https://www.mysql.com/",
          imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg",
        },

        // CMS & Static Site Generators
        {
          name: "Hexo",
          link: "https://hexo.io/",
          imgSrc: "https://www.vectorlogo.zone/logos/hexoio/hexoio-icon.svg",
        },
        {
          name: "Hugo",
          link: "https://gohugo.io/",
          imgSrc: "https://api.iconify.design/logos-hugo.svg",
        },
        {
          name: "Jekyll",
          link: "https://jekyllrb.com/",
          imgSrc: "https://www.vectorlogo.zone/logos/jekyllrb/jekyllrb-icon.svg",
        }
      ],
      showDialog: false,
      email: 'james20081204@gmail.com'
    }
  },
  mounted() {
    // Initialize Typed.js
    new Typed('#typed', {
      strings: [
        "A passionate teenage open-source developer from China",
        "A Python enthusiast",
        "An AI and Machine Learning lover"
      ],
      typeSpeed: 50,
      backSpeed: 25,
      loop: true,
    });

    // Initialize Bootstrap Carousel with touch support
    const carousel = new Carousel(document.getElementById('testimonialCarousel'), {
      interval: 5000,
      touch: true,
      wrap: true
    });

    // Add swipe support
    const testimonialSection = document.getElementById('testimonialCarousel');
    let touchStartX = 0;
    let touchEndX = 0;

    testimonialSection.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    testimonialSection.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        carousel.next();
      }
      if (touchEndX > touchStartX + swipeThreshold) {
        carousel.prev();
      }
    }

    // Add section scrolling
    if (this.$route.meta.section) {
      const element = document.getElementById(this.$route.meta.section)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  },
  methods: {
    handleEmailClick() {
      const mailtoUrl = `mailto:${this.email}`;
      window.open(mailtoUrl, '_self');
      
      // 延迟检查mailto是否成功打开
      setTimeout(() => {
        // 尝试获取焦点
        window.focus();
        
        // 只有当原始窗口仍然可见时才执行复制和显示对话框
        if (document.visibilityState === 'visible') {
          try {
            // 只在mailto失败时尝试复制
            const copySuccess = this.copyToClipboard(this.email);
            if (copySuccess) {
              this.showDialog = true;
            }
          } catch (err) {
            console.log('Clipboard access not available');
          }
        }
      }, 500);
    },
    
    copyToClipboard(text) {
      try {
        if (!document.hasFocus()) {
          window.focus();
        }
        
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text)
            .then(() => true)
            .catch(() => {
              // 如果剪贴板API失败，回退到传统方法
              return this.fallbackCopyToClipboard(text);
            });
          return true;
        }
        
        return this.fallbackCopyToClipboard(text);
      } catch (err) {
        return false;
      }
    },
    
    fallbackCopyToClipboard(text) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        
        if (!document.hasFocus()) {
          window.focus();
        }
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          textArea.remove();
          return true;
        } catch (err) {
          textArea.remove();
          return false;
        }
      } catch (err) {
        return false;
      }
    },

    closeDialog() {
      this.showDialog = false;
    }
  }
}
</script>

<style scoped>
/* Header styles */
header {
  padding-top: 120px; /* Increased from 80px */
  padding-bottom: 60px; /* Added padding bottom */
  background: linear-gradient(rgba(193, 161, 115, 0.8), rgba(140, 115, 85, 0.8));
  color: #ffffff;
  min-height: 400px; /* Increased from 350px */
}

header h1 {
  font-size: 3rem; /* Increased font size */
  margin-bottom: 1.5rem; /* Added margin bottom */
}

header h3 {
  font-size: 1.8rem; /* Increased font size */
  margin-bottom: 2rem; /* Added margin bottom */
}

/* Section styles */
section {
  padding: 60px 0;
  background-color: var(--background-color);
}

/* Skills section specific styles */
.skill-item {
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  transition: transform 0.3s ease;
}

.skill-item img {
  width: 60px;
  height: 60px;
  margin-bottom: 8px;
  transition: transform 0.3s ease;
}

.skill-item:hover {
  transform: translateY(-5px);
}

.skill-item:hover img {
  transform: scale(1.1);
}

.skill-item p {
  margin: 10px 0 0;
  color: var(--text-color);
  font-size: 14px;
}

/* Progress bars */
.progress {
  height: 20px;
  background-color: var(--accent-color);
  margin-bottom: 20px;
  border-radius: 10px;
}

.progress-bar {
  background-color: var(--primary-color);
  transition: width 1s ease;
  border-radius: 10px;
}

/* Project items - 修复大小不一致问题 */
.project-item {
  background-color: var(--accent-color);
  border: 1px solid var(--primary-color);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;  /* 添加固定高度 */
  display: flex;  /* 使用 flex 布局 */
  flex-direction: column;  /* 垂直排列 */
  justify-content: space-between;  /* 内容均匀分布 */
}

.project-item h4 {
  margin-bottom: 15px;
}

.project-item a {
  color: var(--primary-color) !important;  /* 修改链接颜色 */
  text-decoration: none;
  transition: color 0.3s ease;
}

.project-item a:hover {
  color: var(--secondary-color) !important;
}

/* Testimonials - 修复滚动问题 */
#testimonials {
  padding: 60px 0;
}

.carousel-item {
  padding: 20px;
  text-align: center;
  min-height: 150px;  /* 添加最小高度 */
}

.carousel-item p {
  font-size: 1.2em;
  font-style: italic;
  margin-bottom: 20px;
  color: var(--text-color);
}

.carousel-item h5 {
  color: var(--primary-color);
}

/* Contact section - 增加联系方式的���体大小和可见度 */
#contact {
  padding: 100px 0; /* 增加上下间距 */
}

#contact .container {
  max-width: 800px;
}

#contact h2 {
  font-size: 3rem; /* 增加标题大小 */
  margin-bottom: 2.5rem;
  color: var(--primary-color);
  font-weight: 600;
}

#contact p {
  font-size: 1.5rem; /* 增加正文字体大小 */
  line-height: 2;
  margin-bottom: 2rem;
  color: var(--text-color);
}

#contact a {
  font-size: 1.8rem; /* 增加链接字体大小 */
  font-weight: 600;
  color: var(--primary-color) !important;
  transition: all 0.3s ease;
  text-decoration: underline;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

#contact a:hover {
  color: var(--secondary-color) !important;
  background-color: rgba(var(--primary-color-rgb), 0.1);
  transform: translateY(-2px);
}

/* Contact section responsive styles */
@media (max-width: 768px) {
  #contact {
    padding: 60px 0;
  }

  #contact h2 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }

  #contact p {
    font-size: 1.3rem;
    line-height: 1.8;
    padding: 0 20px;
  }

  #contact a {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  #contact h2 {
    font-size: 2rem;
  }

  #contact p {
    font-size: 1.2rem;
    padding: 0 15px;
  }

  #contact a {
    font-size: 1.3rem;
  }
}

/* Global link styles - 修复所有链接颜色 */
a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: var(--secondary-color);
  text-decoration: none;
}

/* Testimonial carousel controls - 添加轮播控制 */
#testimonialCarousel {
  position: relative;
}

.carousel-control-prev,
.carousel-control-next {
  width: 40px;
  height: 40px;
  background-color: var(--primary-color);
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.carousel-control-prev:hover,
.carousel-control-next:hover {
  opacity: 1;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  width: 20px;
  height: 20px;
}

/* Section spacing */
section {
  padding: 60px 0;
  position: relative;
}

/* Add consistent container padding */
.container {
  padding: 0 15px;
  margin: 0 auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .project-item {
    height: auto;
    min-height: 150px;
  }
  
  .carousel-item {
    min-height: 150px;
    padding: 20px;
  }
  
  .carousel-item p {
    font-size: 1em;
  }
  
  .carousel-control-prev,
  .carousel-control-next {
    width: 40px;
    height: 40px;
  }
  
  header {
    padding-top: 100px;
    min-height: 350px;
  }

  header h1 {
    font-size: 2.2rem;
    margin-bottom: 1rem;
  }

  header h3 {
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
  }

  #contact h2 {
    font-size: 2rem;
  }

  #contact p {
    font-size: 1.1rem;
  }

  #contact a {
    font-size: 1.2rem;
  }
}

@media (max-width: 576px) {
  .skill-item {
    width: 33.33%;
    padding: 5px;
  }

  .skill-item img {
    width: 40px;
    height: 40px;
  }

  .skill-item p {
    font-size: 12px;
    margin-top: 5px;
  }

  .project-item {
    padding: 12px;
  }

  .project-item h4 {
    font-size: 1.1rem;
  }

  .friend-card {
    padding: 12px;
  }

  .friend-avatar {
    width: 50px;
    height: 50px;
  }

  .friend-name {
    font-size: 1rem;
  }

  .friend-description {
    font-size: 0.8rem;
  }

  header {
    padding-top: 90px;
    min-height: 300px;
  }

  header h1 {
    font-size: 1.8rem;
  }

  header h3 {
    font-size: 1.2rem;
  }

  #contact h2 {
    font-size: 1.8rem;
  }

  #contact p {
    font-size: 1rem;
  }

  #contact a {
    font-size: 1.1rem;
  }
}

/* Animation enhancements */
[data-aos] {
  transition-duration: 800ms;
}

.progress-bar-animated {
  animation: progress-bar-stripes 1s linear infinite;
}

/* Section headers */
section h2 {
  color: var(--primary-color);
  margin-bottom: 30px;
  position: relative;
  text-align: center;
}

section h2::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: var(--primary-color);
}

/* Enhanced Testimonials Styles */
#testimonials {
    padding: 60px 0;
    background-color: var(--background-color);
}

.testimonial-content {
    padding: 20px;
    margin: 0 auto;
    max-width: 800px;
    text-align: center;
    min-height: 150px;
}

.testimonial-content p {
    font-size: 1.2em;
    font-style: italic;
    margin-bottom: 20px;
    color: var(--text-color);
    line-height: 1.6;
}

.testimonial-content h5 {
    color: var(--primary-color);
    font-weight: 600;
}

/* Carousel Controls */
.carousel-control-prev,
.carousel-control-next {
    width: 50px;
    height: 50px;
    background-color: var(--primary-color);
    border-radius: 50%;
    opacity: 0.7;
    top: 50%;
    transform: translateY(-50%);
    transition: opacity 0.3s ease;
}

.carousel-control-prev:hover,
.carousel-control-next:hover {
    opacity: 1;
    background-color: var(--secondary-color);
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
    width: 24px;
    height: 24px;
}

/* Carousel Indicators */
.carousel-indicators {
    bottom: -50px;
}

.carousel-indicators button {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin: 0 5px;
    background-color: var(--primary-color);
    opacity: 0.5;
    transition: opacity 0.3s ease;
}

.carousel-indicators button.active {
    opacity: 1;
}

/* Add touch support */
#testimonialCarousel {
    touch-action: pan-y pinch-zoom;
}

@media (max-width: 768px) {
    .testimonial-content {
        padding: 20px;
    }
    
    .testimonial-content p {
        font-size: 1em;
    }
    
    .carousel-control-prev,
    .carousel-control-next {
        width: 40px;
        height: 40px;
    }
}

/* Friends Section Styles */
.friend-card {
  background-color: var(--accent-color);
  border: 1px solid var(--primary-color);
  border-radius: 12px;
  padding: 15px;
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.friend-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.friend-card-content {
  text-align: center;
}

.friend-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-bottom: 12px;
  object-fit: cover;
  border: 2px solid var(--primary-color);
}

.friend-name {
  color: var(--primary-color);
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.friend-description {
  color: var (--text-color);
  font-size: 0.9rem;
  margin-bottom: 15px;
  line-height: 1.4;
}

.friend-link {
  display: inline-block;
  color: var(--primary-color);
  text-decoration: none;
  padding: 8px 15px;
  border: 1px solid var(--primary-color);
  border-radius: 20px;
  transition: all 0.3s ease;
  margin-top: auto;
}

.friend-link:hover {
  background-color: var(--primary-color);
  color: var(--background-color);
}

.friend-link i {
  margin-left: 5px;
  font-size: 0.9em;
}

/* Responsive adjustments for social icons */
@media (max-width: 768px) {
  .social-icon {
    width: 50px;
    height: 50px;
    font-size: 24px;
    margin: 0 12px;
  }
}

@media (max-width: 480px) {
  .social-icon {
    width: 45px;
    height: 45px;
    font-size: 20px;
    margin: 0 10px;
  }
}

/* 响应式布局优化 */
@media (max-width: 1200px) {
  .container {
    max-width: 95%;
    padding: 0 20px;
  }

  header {
    padding-top: 100px;
    min-height: 300px;
  }
}

@media (max-width: 992px) {
  section {
    padding: 40px 0;
  }

  .skill-item {
    width: 33.33%;
  }

  .friend-card {
    margin-bottom: 20px;
  }

  .project-item {
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  header {
    padding-top: 80px;
    min-height: 250px;
  }

  header h1 {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
  }

  header h3 {
    font-size: 1.2rem;
  }

  .social-links {
    margin-top: 1rem;
  }

  .skill-item {
    width: 50%;
    padding: 8px;
  }

  .skill-item img {
    width: 50px;
    height: 50px;
  }

  .project-item {
    height: auto;
    min-height: auto;
  }

  .testimonial-content {
    padding: 15px;
  }

  .carousel-control-prev,
  .carousel-control-next {
    width: 35px;
    height: 35px;
  }

  .friend-card {
    height: auto;
  }
}

@media (max-width: 576px) {
  .skill-item {
    width: 33.33%;
    padding: 5px;
  }

  .skill-item img {
    width: 40px;
    height: 40px;
  }

  .skill-item p {
    font-size: 12px;
    margin-top: 5px;
  }

  .project-item {
    padding: 12px;
  }

  .project-item h4 {
    font-size: 1.1rem;
  }

  .friend-card {
    padding: 12px;
  }

  .friend-avatar {
    width: 50px;
    height: 50px;
  }

  .friend-name {
    font-size: 1rem;
  }

  .friend-description {
    font-size: 0.8rem;
  }
}

/* 优化技能部分网格布局 */
.row.justify-content-center {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 0 15px;
}

@media (max-width: 768px) {
  .row.justify-content-center {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.5rem;
  }
}

/* 优化项目卡片布局 */
.project-item {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 优化朋友卡片布局 */
.friends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .friends-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .friend-card {
    padding: 12px;
  }

  .friend-avatar {
    width: 50px;
    height: 50px;
  }

  .friend-name {
    font-size: 1rem;
  }

  .friend-description {
    font-size: 0.8rem;
  }

  header {
    padding-top: 90px;
    min-height: 300px;
  }

  header h1 {
    font-size: 1.8rem;
  }

  header h3 {
    font-size: 1.2rem;
  }

  #contact h2 {
    font-size: 1.8rem;
  }

  #contact p {
    font-size: 1rem;
  }

  #contact a {
    font-size: 1.1rem;
  }
}

/* Testimonials 响应式优化 */
.testimonial-content {
  max-width: 100%;
  padding: 20px;
}

@media (max-width: 768px) {
  .carousel-indicators {
    bottom: -40px;
  }

  .testimonial-content p {
    font-size: 1rem;
    line-height: 1.4;
  }
}

/* 标题响应式优化 */
section h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  section h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
}

/* About section 响应式优化 */
#about p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  #about p {
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 0.8rem;
  }
}

/* Contact section 响应式优化 */
#contact .container {
  max-width: 800px;
}

@media (max-width: 768px) {
  #contact p {
    font-size: 0.9rem;
    padding: 0 15px;
  }
}

/* 整体容器响应式优化 */
.container {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}

@media (min-width: 576px) {
  .container {
    max-width: 540px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}

/* Friends Section 优化 */
.friends-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 固定为3列布局 */
  gap: 2rem;
  padding: 0.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.friend-card {
  background-color: var(--accent-color);
  border: 1px solid var(--primary-color);
  border-radius: 12px;
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.friend-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.friend-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex: 1;
  width: 100%;
}

.friend-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary-color);
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.friend-card:hover .friend-avatar {
  transform: scale(1.05);
}

.friend-name {
  font-size: 1.4rem;
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.friend-description {
  color: var(--text-color);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.friend-link {
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.friend-link:hover {
  background-color: var(--primary-color);
  color: var(--background-color);
  transform: translateY(-2px);
}

.friend-link i {
  font-size: 0.9em;
  transition: transform 0.3s ease;
}

.friend-link:hover i {
  transform: translateX(3px);
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .friends-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    padding: 0 1rem;
  }
}

@media (max-width: 768px) {
  .friends-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .friend-card {
    padding: 1.5rem;
  }

  .friend-avatar {
    width: 80px;
    height: 80px;
  }

  .friend-name {
    font-size: 1.2rem;
  }

  .friend-description {
    font-size: 0.9rem;
  }

  .friend-link {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}

/* Updated Skills section styles */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 20px;
  justify-items: center;
  padding: 0 15px;
}

.skill-item {
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  transition: transform 0.3s ease;
}

.skill-item:hover {
  transform: translateY(-5px);
}

.skill-item img {
  width: 60px;
  height: 60px;
  margin-bottom: 8px;
  transition: transform 0.3s ease;
}

.skill-item img:hover {
  transform: scale(1.1);
}

.skill-item p {
  margin: 10px 0 0;
  color: var(--text-color);
  font-size: 14px;
}

/* Add/Update these styles in your existing <style> section */

.social-links {
  margin-top: 2rem;  /* Increased margin */
}

.social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;  /* Increased from default */
  height: 60px;  /* Increased from default */
  margin: 0 15px;  /* Increased margin between icons */
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 28px;  /* Increased font size */
  transition: all 0.3s ease;
}

.social-icon:hover {
  background-color: white;
  color: var(--primary-color);
  transform: translateY(-5px);
}

/* Responsive adjustments for social icons */
@media (max-width: 768px) {
  .social-icon {
    width: 50px;
    height: 50px;
    font-size: 24px;
    margin: 0 12px;
  }
}

@media (max-width: 480px) {
  .social-icon {
    width: 45px;
    height: 45px;
    font-size: 20px;
    margin: 0 10px;
  }
}

/* 自定义对话框样式 */
.custom-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.dialog-content {
  background-color: var(--background-color);
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  padding: 0;
  position: relative;
  overflow: hidden;
}

.dialog-header {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header h3 {
  margin: 0;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.close-button {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.dialog-body {
  padding: 1.5rem;
}

.success-message {
  color: #28a745;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.options-list {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 1.5rem;
}

.options-list h4 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.option-item:hover {
  background-color: rgba(var(--primary-color-rgb), 0.1);
}

.option-item i {
  color: var(--primary-color);
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.option-item a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
}

.option-item a:hover {
  color: var(--primary-color);
}

/* 动画效果 */
@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.dialog-content {
  animation: slideIn 0.3s ease-out;
}

/* 响应式调整 */
@media (max-width: 576px) {
  .dialog-content {
    width: 95%;
  }
  
  .dialog-header h3 {
    font-size: 1.2rem;
  }
  
  .dialog-body {
    padding: 1rem;
  }
  
  .option-item {
    padding: 0.6rem;
  }
}

/* Update dialog styles */
.option-item i.fab.fa-microsoft {
  color: #00a4ef;  /* Microsoft blue */
}

.option-item i.fab.fa-google {
  color: #ea4335;  /* Google red */
}
</style>
