<template>
  <div class="user-detail-page">
    <div class="header-nav">
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
      <div class="header-title">用户主页</div>
      <div class="header-placeholder"></div>
    </div>

    <div class="user-detail-content">
      <div class="user-profile-card">
        <div class="user-info-section">
          <div class="avatar-wrapper">
            <img
              v-if="user.avatar"
              :src="userAvatar"
              :alt="user.name"
              class="user-large-avatar"
              @error="handleAvatarError"
            />
            <div v-else class="avatar-large-placeholder">
              {{ (user.name || "用户").charAt(0) }}
            </div>
          </div>
          <h1 class="user-name">{{ user.name || "未知用户" }}</h1>
          <p class="user-bio">{{ user.bio || "这个人很懒，还没有写简介" }}</p>
          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-value">{{ articleCount }}</span>
              <span class="stat-label">作品</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ totalViewCount }}</span>
              <span class="stat-label">阅读</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ totalLikeCount }}</span>
              <span class="stat-label">获赞</span>
            </div>
          </div>
        </div>
      </div>

      <div class="user-works-section">
        <h3 class="section-title">用户作品</h3>
        <div class="works-container">
          <van-overlay :show="isLoading" class-name="loading-overlay">
            <div class="loading-wrapper">
              <van-loading type="spinner" color="#1989fa" size="40px" />
              <span class="loading-text">加载中...</span>
            </div>
          </van-overlay>

          <div class="empty-state" v-if="userWorks.length === 0 && !isLoading">
            <div class="empty-icon">📝</div>
            <p class="empty-text">暂无作品</p>
          </div>

          <div v-else class="waterfall-wrapper">
            <div class="waterfall-column">
              <div
                v-for="(item, index) in leftColumnItems"
                :key="item.id"
                class="card-wrapper"
                @click="openDetail(item)"
              >
                <div class="info-card">
                  <div v-if="getCoverImage(item)" class="card-cover">
                    <img
                      :src="getCoverImage(item)"
                      :alt="item.title"
                      class="cover-image"
                      @error="handleImageError"
                    />
                  </div>
                  <div class="card-content">
                    <div
                      class="card-category"
                      :style="{ background: getCategoryColor(item.category) }"
                    >
                      {{ getCategoryName(item.category) }}
                    </div>
                    <h3 class="card-title">{{ item.title }}</h3>
                    <p class="card-summary">{{ item.summary }}</p>
                    <div class="card-footer">
                      <div class="card-stats">
                        <span class="stat-item">
                          <svg
                            class="stat-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          {{ item.views || 0 }}
                        </span>
                        <span class="stat-item">
                          <svg
                            class="stat-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            />
                          </svg>
                          {{ item.likes || 0 }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="waterfall-column">
              <div
                v-for="item in rightColumnItems"
                :key="item.id"
                class="card-wrapper"
                @click="openDetail(item)"
              >
                <div class="info-card">
                  <div v-if="getCoverImage(item)" class="card-cover">
                    <img
                      :src="getCoverImage(item)"
                      :alt="item.title"
                      class="cover-image"
                      @error="handleImageError"
                    />
                  </div>
                  <div class="card-content">
                    <div
                      class="card-category"
                      :style="{ background: getCategoryColor(item.category) }"
                    >
                      {{ getCategoryName(item.category) }}
                    </div>
                    <h3 class="card-title">{{ item.title }}</h3>
                    <p class="card-summary">{{ item.summary }}</p>
                    <div class="card-footer">
                      <div class="card-stats">
                        <span class="stat-item">
                          <svg
                            class="stat-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          {{ item.views || 0 }}
                        </span>
                        <span class="stat-item">
                          <svg
                            class="stat-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            />
                          </svg>
                          {{ item.likes || 0 }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BottomTabBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import BottomTabBar from "../../components/BottomTabBar.vue";
import { getNewsList } from "../../api/news.js";

const router = useRouter();
const route = useRoute();
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const user = ref({
  id: null,
  name: "",
  avatar: "",
  bio: "",
});

const isLoading = ref(false);
const userWorks = ref([]);

const userAvatar = computed(() => {
  if (!user.value.avatar) return "";
  let avatarUrl = user.value.avatar;
  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
    return avatarUrl;
  }
  const baseUrl = IMAGE_BASE_URL.endsWith("/")
    ? IMAGE_BASE_URL.slice(0, -1)
    : IMAGE_BASE_URL;
  const path = avatarUrl.startsWith("/") ? avatarUrl : `/${avatarUrl}`;
  return `${baseUrl}${path}`;
});

const articleCount = computed(() => userWorks.value.length);
const totalViewCount = computed(() =>
  userWorks.value.reduce(
    (sum, item) => sum + (parseInt(item.views, 10) || 0),
    0
  )
);
const totalLikeCount = computed(() =>
  userWorks.value.reduce(
    (sum, item) => sum + (parseInt(item.likes, 10) || 0),
    0
  )
);

const leftColumnItems = computed(() => {
  return userWorks.value.filter((_, index) => index % 2 === 0);
});

const rightColumnItems = computed(() => {
  return userWorks.value.filter((_, index) => index % 2 === 1);
});

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

const getCoverImage = (item) => {
  if (!item.cover) return null;
  let coverUrl = "";
  if (typeof item.cover === "string") {
    const coverArray = item.cover
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);
    if (coverArray.length === 0) return null;
    coverUrl = coverArray[0];
  } else {
    return null;
  }
  if (!coverUrl) return null;
  if (coverUrl.startsWith("http://") || coverUrl.startsWith("https://")) {
    return coverUrl;
  }
  const baseUrl = IMAGE_BASE_URL.endsWith("/")
    ? IMAGE_BASE_URL.slice(0, -1)
    : IMAGE_BASE_URL;
  const path = coverUrl.startsWith("/") ? coverUrl : `/${coverUrl}`;
  return `${baseUrl}${path}`;
};

const handleAvatarError = (e) => {
  e.target.style.display = "none";
};

const handleImageError = (e) => {
  e.target.src =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18"%3E暂无图片%3C/text%3E%3C/svg%3E';
  e.target.style.objectFit = "contain";
};

const openDetail = (item) => {
  router.push({
    path: "/detail",
    query: { id: item.id },
  });
};

const loadUserWorks = async () => {
  const userId = route.query.userId;
  const userName = route.query.userName;
  const userAvatarQuery = route.query.userAvatar;

  if (userName) {
    user.value.name = userName;
  }
  if (userAvatarQuery) {
    user.value.avatar = userAvatarQuery;
  }

  try {
    isLoading.value = true;
    const response = await getNewsList();
    const allArticles = response.data.list || [];
    userWorks.value = allArticles.filter((item) => item.userName === userName);
  } catch (error) {
    console.error("获取用户作品失败:", error);
  } finally {
    isLoading.value = false;
  }
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  loadUserWorks();
});
</script>

<style scoped>
.user-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  padding-bottom: 70px;
}

.header-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
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

.back-icon {
  width: 20px;
  height: 20px;
  color: #667eea;
}

.header-title {
  font-size: 17px;
  font-weight: 600;
  color: #202124;
}

.header-placeholder {
  width: 36px;
}

.user-detail-content {
  max-width: 750px;
  margin: 0 auto;
  padding: 16px;
}

.user-profile-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.user-info-section {
  padding: 28px 20px 24px;
  text-align: center;
}

.avatar-wrapper {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
}

.user-large-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.avatar-large-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 36px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.user-name {
  font-size: 24px;
  font-weight: 700;
  color: #202124;
  margin-bottom: 8px;
}

.user-bio {
  font-size: 15px;
  color: #5f6368;
  line-height: 1.5;
  margin-bottom: 20px;
}

.user-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #202124;
}

.stat-label {
  font-size: 13px;
  color: #9aa0a6;
  font-weight: 500;
}

.user-works-section {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #202124;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.works-container {
  position: relative;
  min-height: 200px;
}

.loading-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 100;
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
  padding: 40px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-text {
  font-size: 15px;
  color: #9aa0a6;
}

.waterfall-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.waterfall-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-wrapper {
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) backwards;
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

.info-card {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0.98) 100%
  );
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.09);
  position: relative;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08), 0 3px 8px rgba(0, 0, 0, 0.12);
}

.info-card:active {
  transform: translateY(-2px) scale(0.98);
  transition: transform 0.1s;
}

.card-cover {
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
  background: #f5f5f5;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.info-card:hover .cover-image {
  transform: scale(1.05);
}

.card-content {
  padding: 14px;
}

.card-category {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.card-title {
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

.card-summary {
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

.card-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.card-stats {
  display: flex;
  gap: 12px;
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
  .user-detail-content {
    padding: 12px;
  }

  .user-info-section {
    padding: 24px 16px 20px;
  }

  .user-large-avatar,
  .avatar-large-placeholder {
    width: 70px;
    height: 70px;
  }

  .user-name {
    font-size: 22px;
  }

  .user-stats {
    gap: 32px;
  }

  .stat-value {
    font-size: 18px;
  }

  .section-title {
    font-size: 16px;
  }

  .user-works-section {
    padding: 16px;
  }

  .waterfall-wrapper {
    gap: 10px;
  }

  .waterfall-column {
    gap: 10px;
  }

  .info-card {
    border-radius: 12px;
  }

  .card-content {
    padding: 12px;
  }

  .card-title {
    font-size: 15px;
  }

  .card-summary {
    font-size: 13px;
  }
}
</style>
