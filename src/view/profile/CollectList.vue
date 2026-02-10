<template>
  <div class="collect-page">
    <div class="header">
      <div class="back-btn" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </div>
      <h1 class="title">我的收藏</h1>
    </div>

    <div class="content">
      <van-overlay :show="isLoading" class-name="loading-overlay">
        <div class="loading-wrapper">
          <van-loading type="spinner" color="#1989fa" size="40px" />
          <span class="loading-text">加载中...</span>
        </div>
      </van-overlay>

      <div class="empty-state" v-if="collectList.length === 0 && !isLoading">
        <div class="empty-icon">⭐</div>
        <p class="empty-text">暂无收藏</p>
      </div>

      <div v-else class="article-list">
        <div v-for="(article, index) in collectList" :key="article.id" class="article-item" @click="openDetail(article)">
          <div v-if="getCoverImage(article)" class="article-cover">
            <img :src="getCoverImage(article)" :alt="article.title" class="cover-image" @error="handleImageError" />
          </div>
          <div class="article-content">
            <div class="article-category" :style="{ background: getCategoryColor(article.category) }">
              {{ getCategoryName(article.category) }}
            </div>
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-summary">{{ article.summary }}</p>
            <div class="article-stats">
              <span class="stat-item">
                <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {{ article.views || 0 }}
              </span>
              <span class="stat-item">
                <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {{ article.likes || 0 }}
              </span>
              <span class="stat-item">
                <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {{ article.collectCount || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getCollectList } from "../../api/news.js";
import { showToast } from 'vant';

const VITE_IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const router = useRouter();

const isLoading = ref(false);
const collectList = ref([]);

const loadCollectList = async () => {
  try {
    isLoading.value = true;
    const response = await getCollectList();
    collectList.value = response.data?.list || response.data || [];
  } catch (error) {
    console.error("获取收藏列表失败:", error);
    showToast("加载失败，请重试");
    collectList.value = [];
  } finally {
    isLoading.value = false;
  }
};

const getCategoryName = (categoryId) => {
  const map = {
    tech: "科技",
    finance: "财经",
    entertainment: "娱乐",
    sports: "体育",
    life: "生活",
  };
  return map[categoryId] || "资讯";
};

const getCategoryColor = (categoryId) => {
  const colorMap = {
    tech: "linear-gradient(135deg, #667eea, #764ba2)",
    finance: "linear-gradient(135deg, #f093fb, #f5576c)",
    entertainment: "linear-gradient(135deg, #fa709a, #fee140)",
    sports: "linear-gradient(135deg, #30cfd0, #330867)",
    life: "linear-gradient(135deg, #a8edea, #fed6e3)",
  };
  return colorMap[categoryId] || "linear-gradient(135deg, #667eea, #764ba2)";
};

const getCoverImage = (article) => {
  if (!article.cover) return null;
  let coverUrl = "";
  if (typeof article.cover === "string") {
    const coverArray = article.cover.split(",").map(url => url.trim()).filter(url => url.length > 0);
    if (coverArray.length === 0) return null;
    coverUrl = coverArray[0];
  } else {
    return null;
  }
  if (!coverUrl) return null;
  if (coverUrl.startsWith("http://") || coverUrl.startsWith("https://")) {
    return coverUrl;
  }
  const baseUrl = VITE_IMAGE_BASE_URL.endsWith("/") ? VITE_IMAGE_BASE_URL.slice(0, -1) : VITE_IMAGE_BASE_URL;
  const path = coverUrl.startsWith("/") ? coverUrl : `/${coverUrl}`;
  return `${baseUrl}${path}`;
};

const handleImageError = (e) => {
  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18"%3E暂无图片%3C/text%3E%3C/svg%3E';
  e.target.style.objectFit = "contain";
};

const openDetail = (article) => {
  router.push({
    path: "/detail",
    query: { id: article.id },
  });
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  loadCollectList();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.collect-page {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.header {
  display: flex;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  gap: 12px;
}

.back-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.back-btn svg {
  width: 20px;
  height: 20px;
  color: white;
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: white;
  flex: 1;
}

.content {
  padding: 16px;
}

.loading-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
}

.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.loading-text {
  font-size: 14px;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 15px;
  color: #9aa0a6;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.article-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.article-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.article-cover {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f5f5f5;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-item:hover .cover-image {
  transform: scale(1.05);
}

.article-content {
  padding: 14px;
}

.article-category {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.article-title {
  font-size: 16px;
  font-weight: 700;
  color: #202124;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-summary {
  font-size: 14px;
  color: #5f6368;
  line-height: 1.5;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-stats {
  display: flex;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9aa0a6;
  font-weight: 400;
}

.stat-icon {
  width: 14px;
  height: 14px;
  opacity: 0.7;
}

@media (max-width: 600px) {
  .header {
    padding: 12px 16px;
  }

  .title {
    font-size: 18px;
  }

  .content {
    padding: 12px;
  }

  .article-cover {
    height: 150px;
  }

  .article-content {
    padding: 12px;
  }

  .article-title {
    font-size: 15px;
  }

  .article-summary {
    font-size: 13px;
  }
}
</style>
