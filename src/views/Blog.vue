<template>
  <div class="blog">
    <div class="blog-header" data-aos="fade-down">
      <h1>Morax's Blog</h1>
      <p>Welcome to my knowledge space</p>
    </div>
    <Transition name="fade" mode="out-in">
      <div class="blog-container">
        <!-- 侧边栏文章菜单 -->
        <div class="sidebar">
          <h3 @click="resetContent" class="articles-title">Articles</h3>
          <!-- Add search bar -->
          <div class="search-container">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search articles..."
              class="search-input"
            />
            <i class="fas fa-search search-icon"></i>
          </div>
          <div class="article-list">
            <div
              v-for="article in filteredArticles"
              :key="article.filename"
              @click="navigateToArticle(article.filename)"
              :class="['article-item', currentArticle === article.filename ? 'active' : '']"
            >
              {{ article.title }}
              <span class="article-date">{{ article.date }}</span>
            </div>
          </div>
        </div>
        
        <!-- 文章内容区 -->
        <div class="content">
          <!-- Update content search div -->
          <Transition name="search-slide">
            <div v-if="renderedContent && isSearchVisible" 
                 class="content-search" 
                 ref="searchBar"
                 :class="{ 'search-active': isSearching }">
              <div class="search-container">
                <input
                  type="text"
                  v-model="contentSearchQuery"
                  placeholder="Search in article... (Press Esc to close)"
                  class="search-input"
                  @input="handleContentSearch"
                  @blur="handleSearchBlur"
                  @keydown.esc="hideSearch"
                  ref="searchInput"
                />
                <i class="fas fa-search search-icon"></i>
                <span v-if="searchResultCount > 0" class="search-count">
                  {{ currentSearchIndex + 1 }}/{{ searchResultCount }}
                </span>
                <div class="search-controls" v-if="searchResultCount > 0">
                  <button @click="previousSearch"><i class="fas fa-chevron-up"></i></button>
                  <button @click="nextSearch"><i class="fas fa-chevron-down"></i></button>
                </div>
              </div>
            </div>
          </Transition>
          <div v-if="!renderedContent" class="welcome-message">
            <i class="fas fa-book-reader welcome-icon"></i>
            <h2>Welcome to My Blog</h2>
            <p>Select an article from the sidebar to start reading.</p>
          </div>
          <div v-else>
            <div class="article-meta">
              <span class="reading-time">
                <i class="fas fa-clock"></i>
                {{ readingTime }}
              </span>
            </div>
            <div class="markdown-content" v-html="renderedContent" ref="articleContent"></div>
            <div class="article-nav" v-if="headings.length > 0" ref="articleNav">
              <div class="article-nav-title">Article Catalog</div>
              <ul class="article-nav-items">
                <li
                  v-for="(heading, index) in headings"
                  :key="index"
                  :class="['article-nav-item', { active: currentHeadingIndex === index }]"
                  :style="{ '--level': heading.level }"
                  @click="scrollToHeading(heading.element)"
                  :title="heading.text"
                >
                  <span>{{ heading.text }}</span>
                </li>
              </ul>
            </div>
            <!-- Add comments container -->
            <div class="comments-section" ref="utterancesContainer"></div>
          </div>
        </div>
      </div>
    </Transition>
    <div class="reading-progress">
      <div class="reading-progress-bar" ref="progressBar"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // For fetching markdown files
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js'; // For code highlighting
import { useHead } from '@vueuse/head'
// Add mark.js import
import Mark from 'mark.js'

export default {
  name: 'BlogPage', 
  setup() {
    useHead({
      title: "Morax's Blog - Technical Articles and Insights",
      meta: [
        { name: 'description', content: 'Read technical articles about Python, Machine Learning, and software development. Personal insights and project experiences from Morax Cheng.' },
        { name: 'keywords', content: 'Technical Blog, Python Tutorial, Machine Learning Guide, Software Development, Programming Tips, Morax Blog' },
        { property: 'og:title', content: "Morax's Blog - Technical Articles" },
        { property: 'og:description', content: 'Technical articles and insights about programming, machine learning, and software development.' },
        { property: 'og:type', content: 'blog' }
      ]
    })
  },
  data() {
    return {
      articles: [
        {
          filename: 'Hello-World.md',
          title: 'Hello World - My First Blog Post',
          date: '2024-08-09'
        },
        {
          filename: 'Machine-Learning-Solution.md',
          title: 'Machine Learning Solution for Global Multi-Port Commodities Flow Problem',
          date: '2024-08-09'
        }
      ],
      markdownContent: '',
      renderedContent: '',
      currentArticle: '',
      turnstileSiteKey: '0x4AAAAAAA1t_hLCxNOO7BvT', // Replace with your actual site key
      isVerified: false,
      searchQuery: '',
      // Add articleContents to store markdown content
      articleContents: {},
      contentSearchQuery: '',
      searchResults: [],
      currentSearchIndex: 0,
      searchResultCount: 0,
      isSearchVisible: false,
      isSearching: false,
      headings: [],
      currentHeadingIndex: 0,
      observer: null,
      readingTime: null, // 添加阅读时间状态
    };
  },
  computed: {
    filteredArticles() {
      const query = this.searchQuery.toLowerCase();
      if (!query) return this.articles;
      
      return this.articles.filter(article => {
        const titleMatch = article.title.toLowerCase().includes(query);
        const contentMatch = this.articleContents[article.filename]?.toLowerCase().includes(query);
        return titleMatch || contentMatch;
      });
    }
  },
  created() {
    // Load article from URL if present
    const articleParam = this.$route.params.article;
    if (articleParam) {
      const decodedFilename = decodeURIComponent(articleParam) + '.md';
      this.fetchMarkdown(decodedFilename);
    }
  },
  mounted() {
    // Add keyboard shortcut listener
    document.addEventListener('keydown', this.handleKeyDown);
    this.setupImageHandlers();
    
    // 添加代码复制事件监听
    document.addEventListener('click', this.handleCodeCopy);
    
    // 添加页面过渡动画
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
      document.body.style.transition = 'opacity 0.3s';
      document.body.style.opacity = '1';
    });

    // Check if user was previously verified
    this.isVerified = localStorage.getItem('turnstileVerified') === 'true';
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    // Clean up event listeners
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('click', this.handleCodeCopy);
    window.removeEventListener('scroll', this.handleScroll);
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  watch: {
    renderedContent: {
      handler() {
        this.$nextTick(() => {
          this.initializeArticleNav();
          this.setupIntersectionObserver();
        });
      }
    }
  },
  methods: {
    // 添加计算阅读时间的方法
    calculateReadingTime(content) {
      // 移除 HTML 标签
      const text = content.replace(/<[^>]*>/g, '');
      
      // 计算字数（英文按空格分词，中文每个字符都算一个词）
      const words = text.trim().split(/\s+/).length;
      const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
      
      // 估算阅读时间（英文 200 词/分钟，中文 300 字/分钟）
      const englishTime = (words - chineseChars) / 200;
      const chineseTime = chineseChars / 300;
      
      // 考虑代码块和图片的额外阅读时间
      const codeBlocks = (content.match(/<pre[^>]*>/g) || []).length;
      const images = (content.match(/<img[^>]*>/g) || []).length;
      
      const codeTime = codeBlocks * 0.5; // 每个代码块额外 30 秒
      const imageTime = images * 0.2;    // 每张图片额外 12 秒
      
      // 总时间（分钟）
      const totalMinutes = englishTime + chineseTime + codeTime + imageTime;
      
      // 格式化时间
      if (totalMinutes < 1) {
        return '< 1 min read';
      } else if (totalMinutes < 60) {
        return `${Math.ceil(totalMinutes)} min read`;
      } else {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.ceil(totalMinutes % 60);
        return `${hours} hr ${minutes} min read`;
      }
    },
    async fetchMarkdown(filename) {
      this.currentArticle = filename;
      const mdFilePath = `/md/${filename}`;
      try {
        const response = await axios.get(mdFilePath);
        this.markdownContent = response.data;
        // Store the content for searching
        this.articleContents[filename] = response.data;

        const md = new MarkdownIt({
          html: true,
          highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
              try {
                const highlighted = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
                // 修改复制按钮实现
                return `<div class="code-block">
                  <div class="code-header">
                    <span class="code-lang">${lang}</span>
                    <button class="copy-button" data-code="${encodeURIComponent(str)}">
                      <i class="fas fa-copy"></i>
                    </button>
                  </div>
                  <pre class="hljs"><code>${highlighted}</code></pre>
                </div>`;
              } catch (__) {
                // Handle highlighting error
              }
            }
            return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
          }
        });

        this.renderedContent = md.render(this.markdownContent);
        
        // 计算并设置阅读时间
        this.readingTime = this.calculateReadingTime(this.renderedContent);
        
        // Load comments after content is rendered
        this.$nextTick(() => {
          this.loadUtterances();
          if (window.MathJax) {
            window.MathJax.typesetPromise();
          }
        });

        // Clear content search when loading new article
        this.contentSearchQuery = '';
        this.clearSearchHighlights();

        // Update page title with article title
        const article = this.articles.find(a => a.filename === filename);
        if (article) {
          document.title = `${article.title} - Morax's Blog`;
        }
      } catch (error) {
        console.error('Error fetching markdown file:', error);
        if (this.$route.params.article) {
          // Redirect to blog home if article not found
          this.$router.push('/blog');
        }
      }
    },
    formatArticleTitle(filename) {
      // 移除 .md 后缀并将连字符替换为空格
      return filename.replace('.md', '').replace(/-/g, ' ');
    },
    setupImageHandlers() {
      let currentFullscreenImage = null;
      let currentOverlay = null;

      const closeFullscreen = () => {
        if (currentFullscreenImage) {
          currentFullscreenImage.classList.remove('fullscreen');
          currentFullscreenImage = null;
        }
        if (currentOverlay) {
          currentOverlay.remove();
          currentOverlay = null;
        }
        // 移除全局点击事件监听器
        document.removeEventListener('click', closeFullscreen);
      };

      document.addEventListener('click', (e) => {
        const target = e.target;
        
        // 如果已经有全屏图片，先关闭它
        if (currentFullscreenImage && !target.isSameNode(currentFullscreenImage)) {
          closeFullscreen();
        }

        // 只有点击的是文章内的图片，且不是已经全屏的图片时，才打开新的预览
        if (target.tagName === 'IMG' && 
            target.closest('.markdown-content') && 
            !target.classList.contains('fullscreen')) {
          e.stopPropagation(); // 阻止事件冒泡
          
          // 创建遮罩层
          const overlay = document.createElement('div');
          overlay.classList.add('overlay');
          document.body.appendChild(overlay);
          
          // 添加全屏类
          target.classList.add('fullscreen');
          
          // 更新当前全屏图片和遮罩层引用
          currentFullscreenImage = target;
          currentOverlay = overlay;
          
          // 添加全局点击事件监听器
          document.addEventListener('click', closeFullscreen);
        }
      });
    },
    resetContent() {
      this.renderedContent = '';
      this.currentArticle = '';
      if (this.$route.params.article) {
        this.$router.push('/blog');
      }
      document.title = "Morax's Blog - Technical Articles and Insights";
      
      // Clear comments when resetting content
      if (this.$refs.utterancesContainer) {
        this.$refs.utterancesContainer.innerHTML = '';
      }
    },
    // eslint-disable-next-line no-unused-vars
    handleTurnstileSuccess(token) {
      this.isVerified = true;
      localStorage.setItem('turnstileVerified', 'true');
    },
    handleContentSearch() {
      if (!this.contentSearchQuery) {
        this.clearSearchHighlights();
        return;
      }
      this.isSearching = true;
      this.highlightSearchResults();
    },

    highlightSearchResults() {
      // Remove existing highlights
      this.clearSearchHighlights();
      
      const content = document.querySelector('.markdown-content');
      if (!content) return;

      const query = this.contentSearchQuery;
      const instance = new Mark(content);
      
      instance.mark(query, {
        separateWordSearch: false,
        done: (count) => {
          this.searchResultCount = count;
          this.currentSearchIndex = count > 0 ? 0 : -1;
          if (count > 0) {
            this.scrollToCurrentMatch();
          }
        }
      });
    },

    clearSearchHighlights() {
      const content = document.querySelector('.markdown-content');
      if (!content) return;
      
      const instance = new Mark(content);
      instance.unmark();
      
      this.searchResultCount = 0;
      this.currentSearchIndex = -1;
    },

    scrollToCurrentMatch() {
      const marks = document.querySelectorAll('mark');
      if (marks.length === 0) return;

      // Remove active class from all marks
      marks.forEach(mark => mark.classList.remove('active'));

      // Add active class to current mark
      const currentMark = marks[this.currentSearchIndex];
      currentMark.classList.add('active');

      // Scroll the mark into view
      currentMark.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    },

    nextSearch() {
      if (this.searchResultCount === 0) return;
      this.currentSearchIndex = (this.currentSearchIndex + 1) % this.searchResultCount;
      this.scrollToCurrentMatch();
    },

    previousSearch() {
      if (this.searchResultCount === 0) return;
      this.currentSearchIndex = (this.currentSearchIndex - 1 + this.searchResultCount) % this.searchResultCount;
      this.scrollToCurrentMatch();
    },
    // Add new method
    handleKeyDown(e) {
      // Check for Cmd+F (Mac) or Ctrl+F (Windows)
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        if (this.renderedContent) {
          e.preventDefault(); // Prevent default browser search
          if (this.isSearchVisible) {
            this.hideSearch(); // Toggle off if already visible
          } else {
            this.showSearch(); // Toggle on if hidden
          }
        }
      }
      // Handle ESC key
      else if (e.key === 'Escape' && this.isSearchVisible) {
        e.preventDefault();
        this.hideSearch();
      }
    },

    showSearch() {
      this.isSearchVisible = true;
      this.isSearching = true;
      this.$nextTick(() => {
        this.$refs.searchInput?.focus();
      });
    },

    hideSearch() {
      this.isSearchVisible = false;
      this.isSearching = false;
      this.contentSearchQuery = '';
      this.clearSearchHighlights();
    },

    handleSearchBlur() {
      // Only hide if there's no active search
      if (!this.contentSearchQuery) {
        this.isSearching = false;
      }
    },
    // Add this new method
    navigateToArticle(filename) {
      // Remove .md extension and encode for URL
      const urlParam = encodeURIComponent(filename.replace('.md', ''));
      this.$router.push(`/blog/${urlParam}`);
      this.fetchMarkdown(filename);
    },
    // Add new method to load utterances
    loadUtterances() {
      // Remove existing script if any
      const existingScript = document.querySelector('.utterances-frame');
      if (existingScript) {
        existingScript.remove();
      }

      // Create new script element
      const utterancesScript = document.createElement('script');
      utterancesScript.src = 'https://utteranc.es/client.js';
      utterancesScript.setAttribute('repo', 'fzlzjerry/fzlzjerry.github.io');
      utterancesScript.setAttribute('issue-term', 'title');
      utterancesScript.setAttribute('theme', 'github-light');
      utterancesScript.setAttribute('crossorigin', 'anonymous');
      utterancesScript.async = true;

      // Clear and append to container
      if (this.$refs.utterancesContainer) {
        this.$refs.utterancesContainer.innerHTML = '';
        this.$refs.utterancesContainer.appendChild(utterancesScript);
      }
    },
    initializeArticleNav() {
      if (!this.$refs.articleContent) return;
      
      // 获取所有标题元素
      const headingElements = this.$refs.articleContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
      this.headings = Array.from(headingElements).map(el => ({
        text: el.textContent,
        element: el,
        level: parseInt(el.tagName.charAt(1)),
      }));
    },

    setupIntersectionObserver() {
      if (this.observer) {
        this.observer.disconnect();
      }

      const options = {
        rootMargin: '-100px 0px -85%',
        threshold: [0, 0.2, 0.5, 0.8, 1.0]
      };

      let lastMainHeadingIndex = 0;

      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const index = this.headings.findIndex(h => h.element === entry.target);
          if (index === -1) return;

          const heading = this.headings[index];
          
          // 如果是主标题（h1或h2）且正在进入视图
          if (heading.level <= 2 && entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            lastMainHeadingIndex = index;
            this.currentHeadingIndex = index;
            this.updateArticleNav();
          }
          // 如果是子标题且在视图中占比较高
          else if (heading.level > 2 && entry.isIntersecting && entry.intersectionRatio >= 0.8) {
            // 检查这个子标题是否属于当前主标题
            let currentMainHeading = this.headings[lastMainHeadingIndex];
            if (currentMainHeading && heading.level > currentMainHeading.level) {
              this.currentHeadingIndex = index;
              this.updateArticleNav();
            }
          }
          // 如果标题离开视图，回到其父标题
          else if (!entry.isIntersecting && this.currentHeadingIndex === index) {
            // 向上查找最近的可见主标题
            for (let i = index - 1; i >= 0; i--) {
              const element = this.headings[i].element;
              const rect = element.getBoundingClientRect();
              if (rect.top < window.innerHeight * 0.5 && rect.bottom > 0) {
                this.currentHeadingIndex = i;
                this.updateArticleNav();
                break;
              }
            }
          }
        });
      }, options);

      this.headings.forEach(heading => {
        this.observer.observe(heading.element);
      });
    },

    updateArticleNav() {
      if (!this.$refs.articleNav) return;
      
      const activeItem = this.$refs.articleNav.querySelector('.article-nav-item.active');
      if (activeItem) {
        activeItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    },

    scrollToHeading(element) {
      const offset = 120; // 增加偏移量
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    },

    handleScroll() {
      if (!this.$refs.progressBar || !this.$refs.articleContent) return;

      const windowHeight = window.innerHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const articleTop = this.$refs.articleContent.offsetTop;
      const articleHeight = this.$refs.articleContent.offsetHeight;
      
      // 计算阅读进度
      const progress = Math.max(0, Math.min(1, (scrollTop - articleTop) / (articleHeight - windowHeight)));
      this.$refs.progressBar.style.width = `${progress * 100}%`;
    },

    // 添加代码复制处理方法
    handleCodeCopy(event) {
      const button = event.target.closest('.copy-button');
      if (!button) return;

      const code = decodeURIComponent(button.dataset.code);
      navigator.clipboard.writeText(code).then(() => {
        // 可以添加复制成功的视觉反馈
        const icon = button.querySelector('i');
        icon.classList.remove('fa-copy');
        icon.classList.add('fa-check');
        setTimeout(() => {
          icon.classList.remove('fa-check');
          icon.classList.add('fa-copy');
        }, 2000);
      });
    },
  }
}
</script>

<style scoped>
/* 移除默认的highlight.js样式导入 */
/* @import "~highlight.js/styles/default.css"; */

.blog {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 0;
  padding-top: 60px; /* 为导航栏留出空间 */
}

/* 头部样式优化 */
.blog-header {
  text-align: center;
  padding: 0;  /* 移除padding */
  background: linear-gradient(rgba(193, 161, 115, 0.8), rgba(140, 115, 85, 0.8));
  margin: 0;
  color: #ffffff;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  box-sizing: border-box;
  height: 300px;  /* 固定高度 */
  display: flex;  /* 使用flex布局 */
  flex-direction: column;
  justify-content: center;  /* 垂直居中 */
  align-items: center;     /* 水平居中 */
}

.blog-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #ffffff;
  padding: 0 2rem;  /* 添加水平内边距 */
}

.blog-header p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  opacity: 0.8;
  padding: 0 2rem;  /* 添加水平内边距 */
}

/* 调整内容容器的位置 */
.blog-container {
  display: flex;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 2rem auto;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  padding: 1.5rem;
  min-height: calc(100vh - 350px);
}

/* 侧边栏样式 */
.sidebar {
  width: 280px;
  min-width: 280px;
  padding: 1.2rem;     /* 减小内边距 */
  background-color: #f8f9fa;
  border-radius: 12px 0 0 12px;
  border-right: 1px solid #e9ecef;
}

.sidebar h3 {
  margin-bottom: 1.2rem;  /* 减小标题底部间距 */
  padding-bottom: 0.4rem; /* 减小底部边框间距 */
  border-bottom: 2px solid var(--primary-color, #007bff);
  color: var(--text-color, #343a40);
  font-weight: 600;
}

.articles-title {
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.articles-title:hover {
  color: var(--primary-color, #007bff);
  transform: translateX(5px);
}

.articles-title::before {
  content: '←';
  margin-right: 0.5rem;
  opacity: 0;
  transition: all 0.3s ease;
}

.articles-title:hover::before {
  opacity: 1;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.article-item {
  padding: 0.8rem;        /* 减小文章项内边距 */
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-color, #495057);
  background-color: transparent;
  margin-bottom: 0.4rem;  /* 减小文章项之间的间距 */
  display: flex;
  flex-direction: column;
  gap: 0.3rem;           /* 减小标题和日期之间的间距 */
}

.article-item:hover {
  background-color: rgba(193, 161, 115, 0.1); /* 修改为网站主色调的透明版本 */
  transform: translateX(5px);
}

.article-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: rgb(193, 161, 115); /* 修改为网站主色调 */
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.article-item.active {
  background-color: rgb(193, 161, 115); /* 修改为网站主色调 */
  color: #ffffff;
}

/* 内容区样式 */
.content {
  flex: 1;
  padding: 1.5rem;      /* 减小内容区内边距 */
  overflow-y: auto;
  position: relative;
}

.markdown-content {
  line-height: 1.8;
  font-size: 1.1rem;
  color: var(--text-color, #2c3e50);
  max-width: 800px;
  margin: 0 auto;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin: 2.5rem 0 1.5rem;
  font-weight: 600;
  line-height: 1.25;
  color: var(--heading-color, #1a1a1a);
}

.markdown-content :deep(h1) {
  font-size: 2.2rem;
  border-bottom: 2px solid var(--border-color, #eaecef);
  padding-bottom: 0.5rem;
}

.markdown-content :deep(h2) {
  font-size: 1.8rem;
  border-bottom: 1px solid var(--border-color, #eaecef);
  padding-bottom: 0.4rem;
}

.markdown-content :deep(h3) { font-size: 1.5rem; }
.markdown-content :deep(h4) { font-size: 1.3rem; }
.markdown-content :deep(h5) { font-size: 1.2rem; }
.markdown-content :deep(h6) { font-size: 1.1rem; }

.markdown-content :deep(p) {
  margin: 1.2rem 0;
  text-align: justify;
}

.markdown-content :deep(strong) {
  font-weight: 600;
  color: var(--strong-color, #2c3e50);
}

.markdown-content :deep(blockquote) {
  margin: 2rem 0;
  padding: 1rem 1.5rem;
  border-left: 4px solid var(--primary-color, rgb(193, 161, 115));
  background-color: var(--blockquote-bg, rgba(193, 161, 115, 0.1));
  border-radius: 0 8px 8px 0;
  font-style: italic;
}

.markdown-content :deep(blockquote p) {
  margin: 0;
  color: var(--blockquote-color, #666);
}

/* 优化列表样式 */
.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  padding-left: 1.5rem;
  margin: 1.2rem 0;
}

.markdown-content :deep(li) {
  margin: 0.5rem 0;
  line-height: 1.7;
}

.markdown-content :deep(li::marker) {
  color: var(--primary-color, rgb(193, 161, 115));
}

/* 优化链接样式 */
.markdown-content :deep(a) {
  color: var(--primary-color, rgb(193, 161, 115));
  text-decoration: none;
  border-bottom: 1px dashed var(--primary-color, rgb(193, 161, 115));
  transition: all 0.3s ease;
}

.markdown-content :deep(a:hover) {
  color: var(--primary-color-dark, rgb(163, 131, 85));
  border-bottom-style: solid;
}

/* 优化代码块样式 */
.markdown-content :deep(pre) {
  background-color: var(--code-bg, #ffffff);
  border-radius: 8px;
  padding: 1.2rem;
  margin: 1.5rem 0;
  overflow-x: auto;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.markdown-content :deep(pre code) {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  tab-size: 2;
}

.markdown-content :deep(code):not(pre code) {
  background-color: var(--inline-code-bg, rgba(193, 161, 115, 0.1));
  color: var(--primary-color, rgb(193, 161, 115));
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
}

/* 优化表格样式 */
.markdown-content :deep(table) {
  width: 100%;
  margin: 1.5rem 0;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 0 1px var(--border-color, #eaecef);
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  padding: 0.8rem 1rem;
  border: 1px solid var(--border-color, #eaecef);
  text-align: left;
}

.markdown-content :deep(th) {
  background-color: var(--th-bg, rgba(193, 161, 115, 0.1));
  font-weight: 600;
}

.markdown-content :deep(tr:nth-child(even)) {
  background-color: var(--tr-even-bg, rgba(0, 0, 0, 0.02));
}

/* 添加文章导航 */
.article-nav {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  width: 280px;
  max-height: 75vh;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 
    0 4px 24px rgba(193, 161, 115, 0.15),
    0 1px 2px rgba(193, 161, 115, 0.1);
  padding: 1.5rem 1rem;
  display: none;
  border: 1px solid rgba(193, 161, 115, 0.15);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  scrollbar-width: thin;
  scrollbar-color: rgba(193, 161, 115, 0.3) transparent;
  z-index: 100;
}

.article-nav::-webkit-scrollbar {
  width: 4px;
}

.article-nav::-webkit-scrollbar-track {
  background: transparent;
  margin: 0.5rem;
}

.article-nav::-webkit-scrollbar-thumb {
  background-color: rgba(193, 161, 115, 0.3);
  border-radius: 4px;
}

.article-nav::-webkit-scrollbar-thumb:hover {
  background-color: rgba(193, 161, 115, 0.5);
}

@media (min-width: 1400px) {
  .article-nav {
    display: block;
  }
}

.article-nav-title {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  color: rgb(193, 161, 115);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(193, 161, 115, 0.15);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.article-nav-title::before {
  content: '☰';
  font-size: 1rem;
  opacity: 0.8;
}

.article-nav-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.article-nav-item {
  font-size: 0.85rem;
  padding: 0.6rem;
  margin: 0.1rem 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #666;
  position: relative;
  border: 1px solid transparent;
  line-height: 1.4;
  overflow: hidden;
}

.article-nav-item span {
  display: block;
  padding-left: calc(0.8rem * var(--level, 1));
  transition: all 0.3s ease;
}

.article-nav-item:hover {
  background-color: rgba(193, 161, 115, 0.06);
  color: rgb(193, 161, 115);
  border-color: rgba(193, 161, 115, 0.1);
}

.article-nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background-color: rgb(193, 161, 115);
  border-radius: 0 2px 2px 0;
  transform: scaleY(0);
  transition: transform 0.3s ease;
  transform-origin: top;
}

.article-nav-item:hover::before {
  transform: scaleY(1);
}

.article-nav-item.active {
  background-color: rgba(193, 161, 115, 0.1);
  color: rgb(193, 161, 115);
  font-weight: 500;
  border-color: rgba(193, 161, 115, 0.2);
}

.article-nav-item.active::before {
  transform: scaleY(1);
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .article-nav {
    background: rgba(28, 28, 28, 0.95);
    border-color: rgba(193, 161, 115, 0.2);
    box-shadow: 
      0 4px 24px rgba(0, 0, 0, 0.3),
      0 1px 2px rgba(193, 161, 115, 0.15);
  }
  
  .article-nav:hover {
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 2px 4px rgba(193, 161, 115, 0.2);
  }
  
  .article-nav-title {
    color: rgb(213, 181, 135);
    border-bottom-color: rgba(193, 161, 115, 0.25);
  }
  
  .article-nav-item {
    color: #bbb;
  }
  
  .article-nav-item:hover {
    background-color: rgba(193, 161, 115, 0.15);
    color: rgb(213, 181, 135);
    border-color: rgba(193, 161, 115, 0.25);
  }
  
  .article-nav-item.active {
    background-color: rgba(193, 161, 115, 0.2);
    color: rgb(213, 181, 135);
    border-color: rgba(193, 161, 115, 0.3);
  }
}

/* 添加阅读进度条 */
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--progress-bg, rgba(193, 161, 115, 0.2));
  z-index: 1000;
}

.reading-progress-bar {
  height: 100%;
  background: var(--primary-color, rgb(193, 161, 115));
  width: 0;
  transition: width 0.1s ease;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .markdown-content {
    color: var(--text-color-dark, #e0e0e0);
  }

  .markdown-content :deep(h1),
  .markdown-content :deep(h2),
  .markdown-content :deep(h3),
  .markdown-content :deep(h4),
  .markdown-content :deep(h5),
  .markdown-content :deep(h6) {
    color: var(--heading-color-dark, #fff);
  }

  .markdown-content :deep(blockquote) {
    background-color: var(--blockquote-bg-dark, rgba(193, 161, 115, 0.05));
  }

  .markdown-content :deep(blockquote p) {
    color: var(--blockquote-color-dark, #bbb);
  }

  .markdown-content :deep(pre) {
    background-color: var(--code-bg-dark, #1a1a1a);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .markdown-content :deep(code):not(pre code) {
    background-color: var(--inline-code-bg-dark, rgba(193, 161, 115, 0.15));
  }

  .article-nav {
    background: var(--nav-bg-dark, rgba(45, 45, 45, 0.9));
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .article-nav-item:hover {
    background-color: var(--nav-hover-bg-dark, rgba(193, 161, 115, 0.15));
  }
}

/* 欢迎消息样式 */
.welcome-message {
  text-align: center;
  padding: 3rem 1.5rem; /* 减小欢迎消息内边距 */
  color: var(--text-color, #495057);
}

.welcome-icon {
  font-size: 4rem;
  color: var(--primary-color, #007bff);
  margin-bottom: 1.5rem; /* 减小图标底部间距 */
  opacity: 0.8;
}

.welcome-message h2 {
  margin-bottom: 1rem;
  color: var(--primary-color, #007bff);
}

.welcome-message p {
  font-size: 1.1rem;
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .blog-container {
    margin: -1rem 1rem 2rem;
    padding: 1rem;
  }
  
  .sidebar {
    width: 240px;
    min-width: 240px;
  }
}

@media (max-width: 768px) {
  .blog {
    padding-top: 60px; /* 移动端减小顶部间距 */
  }

  .blog-container {
    flex-direction: column;
    margin: 1rem 0.5rem; /* 移动端调整外边距 */
    padding: 0.8rem;
  }
  
  .sidebar {
    width: 100%;
    min-width: 100%;
    border-radius: 12px 12px 0 0;
    border-right: none;
    border-bottom: 1px solid #e9ecef;
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--background-color);
  }
  
  .content {
    padding: 0.8rem;
  }

  .article-list {
    max-height: 40vh;
    overflow-y: auto;
    padding-right: 0.5rem;
  }

  .article-list::-webkit-scrollbar {
    width: 4px;
  }

  .article-item {
    padding: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .article-item:active {
    transform: scale(0.98);
  }

  .blog-header {
    height: 250px;  /* 移动端减小高度 */
  }
  
  .blog-header h1 {
    font-size: 2rem;
    padding: 0 1rem;
  }
  
  .blog-header p {
    padding: 0 1rem;
  }
  
  .blog-container {
    margin: 1rem;
    border-radius: 12px;
  }
  
  .welcome-message {
    padding: 2rem 1rem;
  }
  
  .welcome-icon {
    font-size: 3rem;
  }
}

/* 美化滚动条 */
.content::-webkit-scrollbar {
  width: 8px;
}

.content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 添加过渡效果 */
.article-item {
  position: relative;
  overflow: hidden;
}

.article-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: rgb(193, 161, 115); /* 修改为网站主色调 */
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.article-item:hover::after {
  transform: scaleX(1);
}

/* 图片样式 */
.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 0.8rem 0;    /* 减小图片上下间距 */
  transition: all 0.3s ease;
  cursor: pointer;
}

.markdown-content :deep(img):hover {
  transform: scale(1.02);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* 大图预览模式 */
.markdown-content :deep(img.fullscreen) {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  max-width: 90vw;
  max-height: 90vh;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  cursor: zoom-out; /* 改变鼠标样式提示可以关闭 */
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.markdown-content :deep(img.fullscreen):hover {
  transform: translate(-50%, -50%) scale(1.02);
}

/* 添加遮罩层 */
.markdown-content :deep(.overlay) {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
  cursor: zoom-out; /* 改变鼠标样式提示可以关闭 */
}

/* 响应式调整 */
@media (max-width: 768px) {
  .markdown-content :deep(img) {
    max-width: 100%;
    margin: 0.5rem 0;
  }
}

/* MathJax 样式与长公式滚动 */

/* 确保公式内容 outline 消除 */
.markdown-content :deep(.MathJax) {
  outline: none;
}

/* 行间公式块若过长，才会出现水平滚动条 */
.markdown-content :deep(.MathJax_Display) {
  max-width: 100%;
  overflow-x: auto; /* 超出容器宽度时才会出现水平滚动条 */
  overflow-y: hidden;
  padding: 0.8rem;     /* 减小公式内边距 */
  margin: 0.8rem 0;    /* 减小公式上下间距 */
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  white-space: nowrap; /* 不换行，确保公式在一行内显示 */
}

/* 为长公式添加可见的水平滚动条样式 */
.markdown-content :deep(.MathJax_Display::-webkit-scrollbar) {
  height: 6px; /* 滚动条高度 */
}

.markdown-content :deep(.MathJax_Display::-webkit-scrollbar-track) {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.markdown-content :deep(.MathJax_Display::-webkit-scrollbar-thumb) {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.markdown-content :deep(.MathJax_Display::-webkit-scrollbar-thumb:hover) {
  background: rgba(0, 0, 0, 0.3);
}

/* 确保公式内容完整显示 */
.markdown-content :deep(.MathJax) {
  min-width: min-content;
}

/* 移动端显示调整 */
@media (max-width: 768px) {
  .markdown-content :deep(.MathJax_Display) {
    padding: 0.5rem;
    font-size: 0.9em;
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .blog {
    background-color: #1a1a1a;
  }

  .blog-container {
    background-color: #2d2d2d;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  }

  .sidebar {
    background-color: #262626;
    border-right-color: #333;
  }

  .article-item {
    color: #e0e0e0;
  }

  .markdown-content {
    color: #e0e0e0;
  }
}

/* 加载动画 */
.loading {
  position: relative;
  opacity: 0.7;
}

.loading::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  border: 3px solid var(--primary-color);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 优化代码块显示 */
.markdown-content :deep(pre) {
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  position: relative;
}

.markdown-content :deep(pre code) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* 代码块工具栏 */
.markdown-content :deep(.code-toolbar) {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.markdown-content :deep(pre:hover .code-toolbar) {
  opacity: 1;
}

.verification-message {
  text-align: center;
  padding: 1rem;
  color: var(--primary-color);
  font-weight: 500;
}

/* Add search styles */
.search-container {
  position: relative;
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.8rem;
  padding-left: 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background-color: #fff;
  color: var(--text-color);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.search-icon {
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  pointer-events: none;
}

/* Dark mode support for search */
@media (prefers-color-scheme: dark) {
  .search-input {
    background-color: #333;
    border-color: #444;
    color: #e0e0e0;
  }
  
  .search-input::placeholder {
    color: #888;
  }
  
  .search-icon {
    color: #888;
  }
}

/* Content search styles - enhanced */
.content-search {
  position: fixed;
  top: 120px;
  left: 2rem;
  transform: none;
  z-index: 100;
  width: 320px; /* Slightly wider */
  padding: 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.content-search .search-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.content-search .search-input {
  width: 100%;
  padding: 0.9rem 1rem 0.9rem 2.8rem;
  border: 1.5px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  margin: 0; /* Remove any margin */
}

.content-search .search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: 1rem;
  line-height: 1;
  pointer-events: none;
}

.search-count {
  font-size: 0.85rem;
  color: #666;
  background: rgba(0, 0, 0, 0.05);
  padding: 0.2rem 0.6rem;
  border-radius: 1rem;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  height: 24px;
  min-width: 40px;
  justify-content: center;
}

.search-controls {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  margin: 0; /* Remove margin */
}

/* Remove any unwanted margins from container */
.content-search .search-container > * {
  margin: 0;
}

/* Dark mode enhancements */
@media (prefers-color-scheme: dark) {
  .content-search {
    background: rgba(35, 35, 35, 0.95);
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  .content-search .search-input {
    background: rgba(45, 45, 45, 0.9);
    border-color: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  .content-search .search-input:focus {
    background: rgba(50, 50, 50, 0.95);
    box-shadow: 
      0 0 0 3px rgba(0, 123, 255, 0.2),
      0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .search-count {
    background: rgba(255, 255, 255, 0.1);
    color: #aaa;
  }

  .search-controls button {
    background: rgba(0, 123, 255, 0.8);
  }

  .search-controls button:hover {
    background: rgba(0, 123, 255, 1);
  }
}

/* Animation refinements */
.search-slide-enter-active,
.search-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-slide-enter-from,
.search-slide-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

/* Mobile refinements */
@media (max-width: 768px) {
  .content-search {
    top: auto;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 3rem);
    padding: 0.8rem;
    border-radius: 12px;
  }

  .search-slide-enter-from,
  .search-slide-leave-to {
    transform: translateX(-50%) translateY(20px);
  }
}

/* Add these new styles */
.content {
  position: relative;
}

.content-search.search-active {
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.2);
}

/* Mark.js styles - updated */
:deep(mark) {
  background: linear-gradient(transparent 0%, rgba(255, 255, 0, 0.3) 0);
  padding: 0 2px;
  color: inherit;
  border-radius: 2px;
  transition: all 0.2s ease;
}

:deep(mark.active) {
  background: linear-gradient(transparent 0%, rgba(255, 165, 0, 0.4) 0);
  box-shadow: 0 0 0 2px rgba(255, 165, 0, 0.2);
}

/* Dark mode support - updated */
@media (prefers-color-scheme: dark) {
  .content-search {
    background: rgba(45, 45, 45, 0.8);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .content-search .search-input {
    background: rgba(45, 45, 45, 0.9);
    border-color: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  .content-search .search-input:focus {
    background: #333;
  }

  :deep(mark) {
    background: linear-gradient(transparent 0%, rgba(255, 255, 0, 0.15) 0);
  }

  :deep(mark.active) {
    background: linear-gradient(transparent 0%, rgba(255, 165, 0, 0.25) 0);
    box-shadow: 0 0 0 2px rgba(255, 165, 0, 0.15);
  }

  .search-count {
    color: #aaa;
  }
}

/* Animation for search results */
@keyframes highlight-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

:deep(mark.active) {
  animation: highlight-pulse 0.5s ease;
}

/* Update content search styles with warm color scheme */
.content-search {
  /* ...existing styles... */
  background: rgba(193, 161, 115, 0.95);
  box-shadow: 
    0 4px 20px rgba(140, 115, 85, 0.15),
    0 0 0 1px rgba(193, 161, 115, 0.1);
}

.content-search .search-input {
  /* ...existing styles... */
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.content-search .search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.content-search .search-input:focus {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 
    0 0 0 3px rgba(193, 161, 115, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.1);
}

.content-search .search-icon {
  color: rgba(255, 255, 255, 0.8);
}

.search-count {
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
  padding: 0.3rem 0.8rem;
  border-radius: 8px;
  font-weight: 500;
}

/* Enhanced search controls */
.search-controls {
  display: flex;
  gap: 0.5rem;
  margin-left: 0.5rem;
}

.search-controls button {
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 1rem;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.search-controls button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-controls button:active {
  transform: translateY(0);
  background: rgba(255, 255, 255, 0.2);
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .content-search {
    background: rgba(140, 115, 85, 0.95);
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  .search-controls button {
    background: rgba(255, 255, 255, 0.1);
  }

  .search-controls button:hover {
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

/* Highlighted text styles */
:deep(mark) {
  background: rgba(193, 161, 115, 0.3);
  color: inherit;
  padding: 0.1em 0.2em;
  border-radius: 3px;
  transition: all 0.2s ease;
}

:deep(mark.active) {
  background: rgba(193, 161, 115, 0.5);
  box-shadow: 0 0 0 2px rgba(193, 161, 115, 0.3);
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .search-controls button {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
}

/* Add styles for comments section */
.comments-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color, #eaeaea);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .comments-section {
    border-top-color: var(--border-color-dark, #333);
  }
}

/* 代码块样式优化 */
.markdown-content :deep(.code-block) {
  margin: 1.5rem 0;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(193, 161, 115, 0.1);
  border: 1px solid rgba(193, 161, 115, 0.2);
}

.markdown-content :deep(.code-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.2rem;
  background: rgba(193, 161, 115, 0.05);
  border-bottom: 1px solid rgba(193, 161, 115, 0.1);
}

.markdown-content :deep(.code-lang) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: #c19161;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.markdown-content :deep(.copy-button) {
  background: transparent;
  border: 1px solid rgba(193, 161, 115, 0.3);
  color: #c19161;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.markdown-content :deep(.copy-button:hover) {
  background: rgba(193, 161, 115, 0.1);
  border-color: #c19161;
}

.markdown-content :deep(.copy-button:active) {
  transform: scale(0.98);
}

.markdown-content :deep(pre.hljs) {
  margin: 0;
  padding: 1.2rem;
  background: #ffffff;
  overflow-x: auto;
}

.markdown-content :deep(code) {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #2c2520;
}

/* 代码高亮配色方案 - 金色系 */
.markdown-content :deep(.hljs-keyword) {
  color: #c19161; /* 主金色 */
  font-weight: bold;
}

.markdown-content :deep(.hljs-built_in) {
  color: #b8860b; /* 暗金色 */
}

.markdown-content :deep(.hljs-type) {
  color: #daa520; /* 金菊色 */
}

.markdown-content :deep(.hljs-literal) {
  color: #cd853f; /* 秘鲁色 */
}

.markdown-content :deep(.hljs-number) {
  color: #b8860b; /* 暗金色 */
}

.markdown-content :deep(.hljs-regexp) {
  color: #d4af37; /* 金色 */
}

.markdown-content :deep(.hljs-string) {
  color: #cd853f; /* 秘鲁色 */
}

.markdown-content :deep(.hljs-comment) {
  color: #999999; /* 灰色 */
  font-style: italic;
}

.markdown-content :deep(.hljs-doctag) {
  color: #c19161;
}

.markdown-content :deep(.hljs-meta) {
  color: #b8860b;
}

.markdown-content :deep(.hljs-tag) {
  color: #daa520;
}

.markdown-content :deep(.hljs-attr) {
  color: #cd853f;
}

.markdown-content :deep(.hljs-attribute) {
  color: #d4af37;
}

.markdown-content :deep(.hljs-name) {
  color: #c19161;
}

.markdown-content :deep(.hljs-bullet) {
  color: #b8860b;
}

.markdown-content :deep(.hljs-code) {
  color: #daa520;
}

.markdown-content :deep(.hljs-emphasis) {
  color: #cd853f;
  font-style: italic;
}

.markdown-content :deep(.hljs-strong) {
  color: #c19161;
  font-weight: bold;
}

.markdown-content :deep(.hljs-formula) {
  color: #b8860b;
}

.markdown-content :deep(.hljs-link) {
  color: #daa520;
  text-decoration: underline;
}

.markdown-content :deep(.hljs-quote) {
  color: #999999;
  font-style: italic;
}

.markdown-content :deep(.hljs-selector-tag) {
  color: #c19161;
}

.markdown-content :deep(.hljs-selector-id) {
  color: #b8860b;
}

.markdown-content :deep(.hljs-selector-class) {
  color: #daa520;
}

.markdown-content :deep(.hljs-selector-attr) {
  color: #cd853f;
}

.markdown-content :deep(.hljs-selector-pseudo) {
  color: #d4af37;
}

.markdown-content :deep(.hljs-template-tag) {
  color: #c19161;
}

.markdown-content :deep(.hljs-template-variable) {
  color: #b8860b;
}

.markdown-content :deep(.hljs-addition) {
  color: #2fa245;
  background: rgba(47, 162, 69, 0.1);
}

.markdown-content :deep(.hljs-deletion) {
  color: #d73a49;
  background: rgba(215, 58, 73, 0.1);
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .markdown-content :deep(.code-block) {
    background: #ffffff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  .markdown-content :deep(.code-header) {
    background: rgba(193, 161, 115, 0.15);
    border-bottom-color: rgba(193, 161, 115, 0.25);
  }

  .markdown-content :deep(pre.hljs) {
    background: #ffffff;
  }

  .markdown-content :deep(code) {
    color: #2c2520;
  }
}

/* 行内代码样式 */
.markdown-content :deep(:not(pre) > code) {
  background: rgba(193, 161, 115, 0.1);
  color: #c19161;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.9em;
  border: 1px solid rgba(193, 161, 115, 0.2);
}

/* 代码块滚动条样式 */
.markdown-content :deep(pre.hljs::-webkit-scrollbar) {
  height: 8px;
  background: #ffffff;
  border-radius: 4px;
}

.markdown-content :deep(pre.hljs::-webkit-scrollbar-thumb) {
  background: rgba(193, 161, 115, 0.2);
  border-radius: 4px;
  border: 2px solid #ffffff;
}

.markdown-content :deep(pre.hljs::-webkit-scrollbar-thumb:hover) {
  background: rgba(193, 161, 115, 0.3);
}

/* 添加阅读时间样式 */
.article-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(193, 161, 115, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(193, 161, 115, 0.1);
}

.reading-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #c19161;
  font-size: 0.9rem;
  font-weight: 500;
}

.reading-time i {
  font-size: 1rem;
  opacity: 0.8;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .article-meta {
    background: rgba(193, 161, 115, 0.1);
    border-color: rgba(193, 161, 115, 0.2);
  }
}
</style>