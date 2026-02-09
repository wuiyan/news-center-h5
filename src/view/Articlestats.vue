<template>
  <div class="article-stats-page">
    <!-- 顶部导航栏 -->
    <div class="top-navbar">
      <div class="back-btn" @click="goBack">
        <svg
          class="back-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </div>
      <h1 class="navbar-title">文章统计</h1>
      <div class="navbar-placeholder"></div>
    </div>
    <div class="main-content">
      <div class="content-container">
        <!-- 顶部统计卡片 -->
        <div class="stats-overview-card">
          <h2 class="stats-title">我的文章统计</h2>
          <div class="overview-stats">
            <div class="overview-stat-item">
              <span class="overview-icon">📊</span>
              <div class="overview-info">
                <span class="overview-value">{{ formatNumber(totalStats.published) }}</span>
                <span class="overview-label">发布文章</span>
              </div>
            </div>
            <div class="overview-stat-item">
              <span class="overview-icon">👁️</span>
              <div class="overview-info">
                <span class="overview-value">{{ formatNumber(totalStats.totalViews) }}</span>
                <span class="overview-label">总浏览量</span>
              </div>
            </div>
            <div class="overview-stat-item">
              <span class="overview-icon">❤️</span>
              <div class="overview-info">
                <span class="overview-value">{{ formatNumber(totalStats.totalLikes) }}</span>
                <span class="overview-label">总获赞数</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 文章列表 -->
        <div class="articles-section">
          <div class="section-header">
            <h3 class="section-title">文章列表</h3>
            <div class="sort-filter">
              <button 
                class="sort-btn" 
                :class="{ active: sortBy === 'time' }" 
                @click="sortBy = 'time'"
              >
                <span class="sort-icon">🕐</span>
                <span class="sort-text">最新</span>
              </button>
              <button 
                class="sort-btn" 
                :class="{ active: sortBy === 'views' }" 
                @click="sortBy = 'views'"
              >
                <span class="sort-icon">👁️</span>
                <span class="sort-text">浏览</span>
              </button>
              <button 
                class="sort-btn" 
                :class="{ active: sortBy === 'likes' }" 
                @click="sortBy = 'likes'"
              >
                <span class="sort-icon">❤️</span>
                <span class="sort-text">点赞</span>
              </button>
            </div>
          </div>

          <!-- 文章卡片列表 -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p class="loading-text">加载中...</p>
          </div>

          <div v-else class="article-list">
            <div 
              v-for="article in sortedArticles" 
              :key="article.id"
              class="article-card"
            >
              <div class="article-main">
                <div class="article-header">
                  <h4 class="article-title">{{ article.title }}</h4>
                  <span class="article-status" :class="article.status">
                    {{ getStatusText(article.status) }}
                  </span>
                </div>
                <p class="article-excerpt">{{ article.excerpt }}</p>
                <div class="article-meta">
                  <span class="meta-item">
                    <span class="meta-icon">📅</span>
                    <span class="meta-text">{{ formatDate(article.publishDate) }}</span>
                  </span>
                  <span class="meta-item">
                    <span class="meta-icon">📑</span>
                    <span class="meta-text">{{ article.category }}</span>
                  </span>
                </div>
              </div>
              
              <div class="article-stats">
                <div class="stat-badge views">
                  <span class="badge-icon">👁️</span>
                  <span class="badge-value">{{ formatNumber(article.views) }}</span>
                </div>
                <div class="stat-badge comments">
                  <span class="badge-icon">💬</span>
                  <span class="badge-value">{{ formatNumber(article.comments) }}</span>
                </div>
                <div class="stat-badge likes">
                  <span class="badge-icon">❤️</span>
                  <span class="badge-value">{{ formatNumber(article.likes) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="!loading && articles.length === 0" class="empty-state">
            <span class="empty-icon">📝</span>
            <p class="empty-text">还没有发布任何文章</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getUserNewsList } from "../api/news.js";
import BottomTabBar from "../components/BottomTabBar.vue";

const router = useRouter();

// 排序方式
const sortBy = ref("time");

// 加载状态
const loading = ref(true);

// 文章数据
const articles = ref([]);

// 总统计数据
const totalStats = ref({
  published: 0,
  totalViews: 0,
  totalLikes: 0,
});

// 类别映射（中文）
const categoryMap = {
  life: "生活",
  tech: "科技",
  travel: "旅行",
  food: "美食",
  study: "学习",
  work: "工作",
  other: "其他",
};

// 排序后的文章列表
const sortedArticles = computed(() => {
  const sorted = [...articles.value];
  switch (sortBy.value) {
    case 'views':
      return sorted.sort((a, b) => b.views - a.views);
    case 'likes':
      return sorted.sort((a, b) => b.likes - a.likes);
    case 'time':
    default:
      return sorted.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  }
});

// 加载文章数据
const loadArticles = async () => {
  loading.value = true;
  try {
    const response = await getUserNewsList();
    
    // 处理响应数据
    const data = response?.data ?? response;
    
    if (data && data.list) {
      // 更新总统计数据
      totalStats.value = {
        published: data.total || 0,
        totalViews: data.totalViews || 0,
        totalLikes: data.totalLikes || 0,
      };
      
      // 转换文章列表数据
      articles.value = data.list.map(item => ({
        id: item.id,
        title: item.title,
        excerpt: item.summary || "暂无摘要",
        publishDate: item.publishTime,
        category: categoryMap[item.category] || item.category || "其他",
        categoryEn: item.category,
        status: "published", // API 返回的都是已发布的文章
        views: parseInt(item.views) || 0,
        likes: parseInt(item.likes) || 0,
        comments: parseInt(item.comments) || 0,
        cover: item.cover ? item.cover.split(',')[0] : "", // 取第一张封面图
        isLiked: item.isLiked,
      }));
      
      console.log("文章数据加载成功:", articles.value);
    } else {
      console.warn("API 返回数据格式异常:", response);
      articles.value = [];
    }
  } catch (error) {
    console.error("加载文章数据失败:", error);
    articles.value = [];
    // 可以在这里添加错误提示
  } finally {
    loading.value = false;
  }
};

// 格式化数字
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 7) return `${days}天前`;
  if (days < 30) return `${Math.floor(days / 7)}周前`;
  
  return dateStr;
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    published: "已发布",
    draft: "草稿",
    pending: "审核中",
  };
  return statusMap[status] || status;
};


const goBack = () => {
  router.back();
};

onMounted(() => {
  loadArticles();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.article-stats-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  padding-bottom: 20px;  /* 改为 20px，原来是 70px */
  padding-top: 0;  /* 改为 0，原来是 16px */
}

/* 顶部导航栏 */
.top-navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.back-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateX(-2px);
}

.back-btn:active {
  transform: scale(0.95);
}

.back-icon {
  width: 20px;
  height: 20px;
  color: #667eea;
}

.navbar-title {
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: 0.3px;
}

.navbar-placeholder {
  width: 36px;
  flex-shrink: 0;
}

.main-content {
  min-height: calc(100vh - 60px);  /* 调整高度 */
  padding-top: 16px;  /* 添加顶部内边距 */
}

.content-container {
  max-width: 750px;
  margin: 0 auto;
  padding: 0 16px 20px;
}

/* 统计概览卡片 */
.stats-overview-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.09);
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stats-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
  text-align: center;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.overview-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
  border-radius: 12px;
  transition: all 0.3s ease;
}

.overview-stat-item:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
}

.overview-icon {
  font-size: 32px;
  line-height: 1;
}

.overview-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.overview-value {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.overview-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

/* 文章列表区域 */
.articles-section {
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s backwards;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 4px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sort-filter {
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 4px;
  border-radius: 12px;
}

.sort-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  font-weight: 500;
}

.sort-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sort-btn:hover:not(.active) {
  background: rgba(255, 255, 255, 0.15);
}

.sort-icon {
  font-size: 14px;
  line-height: 1;
}

.sort-text {
  font-size: 13px;
}

/* 文章列表 */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.article-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.09);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08);
}

.article-card:active {
  transform: translateY(0) scale(0.98);
}

.article-main {
  flex: 1;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.article-title {
  flex: 1;
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.4;
  word-break: break-word;
}

.article-status {
  flex-shrink: 0;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
}

.article-status.published {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15));
  color: #059669;
}

.article-status.draft {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.15));
  color: #d97706;
}

.article-status.pending {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15));
  color: #2563eb;
}

.article-excerpt {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
}

.meta-icon {
  font-size: 13px;
  line-height: 1;
}

.meta-text {
  font-size: 12px;
  font-weight: 500;
}

/* 文章统计徽章 */
.article-stats {
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.stat-badge {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-badge.views {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1));
}

.stat-badge.comments {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
}

.stat-badge.likes {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
}

.stat-badge:hover {
  transform: scale(1.05);
}

.badge-icon {
  font-size: 18px;
  line-height: 1;
}

.badge-value {
  font-size: 16px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.stat-badge.views .badge-value {
  color: #2563eb;
}

.stat-badge.comments .badge-value {
  color: #059669;
}

.stat-badge.likes .badge-value {
  color: #dc2626;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.09);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(102, 126, 234, 0.1);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.09);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 15px;
  color: #6b7280;
  margin-bottom: 24px;
  font-weight: 500;
}

.create-btn {
  padding: 12px 28px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.create-btn:active {
  transform: translateY(0) scale(0.98);
}

.create-icon {
  font-size: 16px;
  line-height: 1;
}

.create-text {
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .content-container {
    padding: 0 12px 16px;
  }

  .stats-overview-card {
    padding: 20px 16px;
  }

  .stats-title {
    font-size: 18px;
    margin-bottom: 16px;
  }

  .overview-stats {
    gap: 12px;
  }

  .overview-stat-item {
    padding: 12px 8px;
  }

  .overview-icon {
    font-size: 28px;
  }

  .overview-value {
    font-size: 20px;
  }

  .overview-label {
    font-size: 11px;
  }

  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .sort-filter {
    width: 100%;
    justify-content: space-between;
  }

  .sort-btn {
    flex: 1;
    justify-content: center;
  }

  .article-card {
    padding: 16px;
  }

  .article-title {
    font-size: 15px;
  }

  .article-excerpt {
    font-size: 12px;
  }

  .stat-badge {
    padding: 8px 8px;
    gap: 4px;
  }

  .badge-icon {
    font-size: 16px;
  }

  .badge-value {
    font-size: 14px;
  }
}
</style>