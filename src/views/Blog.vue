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
          <div class="article-list">
            <div
              v-for="article in articles"
              :key="article.filename"
              @click="fetchMarkdown(article.filename)"
              :class="['article-item', currentArticle === article.filename ? 'active' : '']"
            >
              {{ article.title }}
              <span class="article-date">{{ article.date }}</span>
            </div>
          </div>
        </div>
        
        <!-- 文章内容区 -->
        <div class="content">
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

export default {
  name: 'BlogPage', 
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
      currentArticle: ''
    };
  },
  mounted() {
    // 移除默认加载第一篇文章的行为
    this.setupImageHandlers();
    
    // 添加页面过渡动画
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
      document.body.style.transition = 'opacity 0.3s';
      document.body.style.opacity = '1';
    });
  },
  methods: {
    async fetchMarkdown(filename) {
      this.currentArticle = filename;
      const mdFilePath = `/md/${filename}`;
      try {
        const response = await axios.get(mdFilePath);
        this.markdownContent = response.data;

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
      } catch (error) {
        console.error('Error fetching markdown file:', error);
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
    }
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
</style>