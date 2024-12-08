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
          <div v-else class="markdown-content" v-html="renderedContent"></div>
        </div>
      </div>
    </Transition>
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
    
    // 添加页面过渡动��
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
      document.body.style.transition = 'opacity 0.3s';
      document.body.style.opacity = '1';
    });

    // Check if user was previously verified
    this.isVerified = localStorage.getItem('turnstileVerified') === 'true';
  },
  beforeUnmount() {
    // Clean up event listener
    document.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
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
                return '<pre class="hljs"><code>' +
                  hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                  '</code></pre>';
              } catch (__) {
                // Handle highlighting error
              }
            }
            return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
          }
        });

        this.renderedContent = md.render(this.markdownContent);
        // 渲染完成后，通知 MathJax 处理新内容
        this.$nextTick(() => {
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
  }
}
</script>

<style scoped>
@import "~highlight.js/styles/default.css";

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
  background-color: rgba(0, 123, 255, 0.1);
  transform: translateX(5px);
}

.article-item.active {
  background-color: var(--primary-color, #007bff);
  color: #ffffff;
}

.article-date {
  font-size: 0.8rem;
  color: inherit;
  opacity: 0.8;
}

/* 内容区样式 */
.content {
  flex: 1;
  padding: 1.5rem;      /* 减小内容区内边距 */
  overflow-y: auto;
  position: relative;
}

.markdown-content {
  line-height: 1.6;
  color: #212529;
  animation: fadeIn 0.4s var(--transition-timing);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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
  background-color: var(--primary-color, #007bff);
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
  margin: 0.8rem 0;    /* 减小图片上��间距 */
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

/* 为长���式添加可见的水平滚动条样式 */
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
</style>