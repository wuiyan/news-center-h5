<template>
  <div class="profile-page">
    <div class="main-content">
      <div class="content-container">
        <div class="user-info-card">
          <div class="settings-icon" @click="showSettingsMenu = true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>

          <div class="avatar-wrapper" @click="goToEdit">
            <div class="avatar" :style="avatarStyle">
              <template v-if="user.avatar">
                <img
                  :src="user.avatar.startsWith('data:') ? user.avatar : VITE_IMAGE_BASE_URL + user.avatar"
                  :alt="user.name"
                  class="avatar-img"
                />
              </template>
              <template v-else>
                {{ (user.name || "未命名用户").charAt(0) }}
              </template>
            </div>
          </div>
          <div class="user-details">
            <h2 class="user-name" @click="goToEdit">{{ user.name }}</h2>
            <p class="user-email" v-if="user.email" @click="goToEdit">{{ user.email }}</p>
            <p class="user-email empty" v-else @click="goToEdit">点击设置邮箱</p>
          </div>
        </div>

        <div class="stats-mini-section">
          <div class="stat-mini-card clickable" @click="goToFollowing">
            <span class="stat-mini-value">{{ formatNumber(stats.following) }}</span>
            <span class="stat-mini-label">关注</span>
          </div>
          <div class="stat-mini-card clickable" @click="goToFollowers">
            <span class="stat-mini-value">{{ formatNumber(stats.followers) }}</span>
            <span class="stat-mini-label">粉丝</span>
          </div>
          <div class="stat-mini-card clickable" @click="goToCollect">
            <span class="stat-mini-value">{{ formatNumber(stats.collects) }}</span>
            <span class="stat-mini-label">收藏</span>
          </div>
        </div>

        <div class="works-section">
          <div class="works-header">
            <h3 class="section-title">我的作品</h3>
            <div class="works-stats">
              <div class="works-stat-item clickable" @click="goToFollowing">
                <svg class="works-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                <span>{{ formatNumber(stats.following) }}</span>
              </div>
              <div class="works-stat-item clickable" @click="goToFollowers">
                <svg class="works-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>{{ formatNumber(stats.followers) }}</span>
              </div>
              <div class="works-stat-item clickable" @click="goToCollect">
                <svg class="works-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>{{ formatNumber(stats.collects) }}</span>
              </div>
            </div>
          </div>
          <div class="works-container">
            <van-overlay :show="isLoading" class-name="loading-overlay">
              <div class="loading-wrapper">
                <van-loading type="spinner" color="#1989fa" size="40px" />
                <span class="loading-text">加载中...</span>
              </div>
            </van-overlay>

            <div class="empty-state" v-if="articleList.length === 0 && !isLoading">
              <div class="empty-icon">📝</div>
              <p class="empty-text">暂无作品</p>
            </div>

            <div v-else class="waterfall-wrapper">
              <div class="waterfall-column">
                <div v-for="(article, index) in leftColumnArticles" :key="article.id" class="card-wrapper" @click="openDetail(article)">
                  <div class="info-card">
                    <div v-if="getCoverImage(article)" class="card-cover">
                      <img :src="getCoverImage(article)" :alt="article.title" class="cover-image" @error="handleImageError" />
                    </div>
                    <div class="card-content">
                      <div class="card-category" :style="{ background: getCategoryColor(article.category) }">
                        {{ getCategoryName(article.category) }}
                      </div>
                      <h3 class="card-title">{{ article.title }}</h3>
                      <p class="card-summary">{{ article.summary }}</p>
                      <div class="card-footer">
                        <div class="card-stats">
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="waterfall-column">
                <div v-for="article in rightColumnArticles" :key="article.id" class="card-wrapper" @click="openDetail(article)">
                  <div class="info-card">
                    <div v-if="getCoverImage(article)" class="card-cover">
                      <img :src="getCoverImage(article)" :alt="article.title" class="cover-image" @error="handleImageError" />
                    </div>
                    <div class="card-content">
                      <div class="card-category" :style="{ background: getCategoryColor(article.category) }">
                        {{ getCategoryName(article.category) }}
                      </div>
                      <h3 class="card-title">{{ article.title }}</h3>
                      <p class="card-summary">{{ article.summary }}</p>
                      <div class="card-footer">
                        <div class="card-stats">
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
    </div>

    <van-popup v-model:show="showSettingsMenu" position="bottom" round class="settings-popup">
      <div class="settings-content">
        <div class="settings-title">设置</div>
        <div class="settings-item" @click="goToSettings">
          <span class="settings-item-icon">⚙️</span>
          <span class="settings-item-label">应用设置</span>
          <span class="settings-arrow">&gt;</span>
        </div>
        <div class="settings-item" @click="goToAbout">
          <span class="settings-item-icon">📝</span>
          <span class="settings-item-label">关于我们</span>
          <span class="settings-arrow">&gt;</span>
        </div>
        <div class="settings-divider"></div>
        <div class="settings-item logout-item" @click="handleLogout">
          <span class="settings-item-icon">🚪</span>
          <span class="settings-item-label">退出登录</span>
          <span class="settings-arrow">&gt;</span>
        </div>
      </div>
    </van-popup>

    <BottomTabBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { getUserInfo } from "../../api/user.js";
import { getUserNewsList } from "../../api/news.js";
import BottomTabBar from "../../components/BottomTabBar.vue";
import { showToast } from 'vant';

const VITE_IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const router = useRouter();

const user = ref({
  id: null,
  name: "",
  email: "",
  password: "",
  avatar: "",
});

const isLoading = ref(false);
const showSettingsMenu = ref(false);

const articleList = ref([]);

const avatarStyle = computed(() => {
  if (user.value.avatar) {
    return {
      background: "#f0f2f5",
    };
  }
  return {
    background: user.value.avatarColor || "linear-gradient(135deg, #667eea, #764ba2)",
  };
});

const stats = ref({
  following: 0,
  followers: 0,
  collects: 0,
});
// 作品数据
const userArticle = ref([]);

const leftColumnArticles = computed(() => {
  return articleList.value.filter((_, index) => index % 2 === 0);
});

const rightColumnArticles = computed(() => {
  return articleList.value.filter((_, index) => index % 2 === 1);
});

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};

watch(user, (newUser) => {
  stats.value = {
    following: newUser.following || 0,
    followers: newUser.followers || 0,
    collects: newUser.collects || 0,
  };
}, { immediate: true, deep: true });

const updateLocalStorage = (newData) => {
  try {
    const safe = { ...newData };
    if (safe.password !== undefined) delete safe.password;
    localStorage.setItem("user", JSON.stringify(safe));
  } catch (e) {
    console.warn("更新本地用户缓存失败:", e);
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

onMounted(() => {
  loadUserData();
  loadUserNews();
});

const loadUserData = async () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      user.value = {
        id: parsed.id || "",
        name: parsed.name?.trim() || "未命名用户",
        email: parsed.email?.trim() || "",
        password: parsed.password || "",
        avatar: parsed.avatar || "",
      };

      try {
        const remote = await getUserInfo();
        const userInfo = remote?.data ?? remote;

        if (userInfo) {
          const mappedData = {
            id: userInfo.id || user.value.id,
            name: userInfo.name?.trim() || user.value.name,
            email: (userInfo.email ?? "").trim() || user.value.email,
            password: userInfo.password || user.value.password,
            avatar: userInfo.avatar || user.value.avatar,
          };
          user.value = mappedData;
          updateLocalStorage(mappedData);
        } else {
          console.warn("接口返回空数据或格式不匹配:", remote);
        }
      } catch (error) {
        console.warn("获取远程用户信息失败:", error);
      }
    } catch (e) {
      console.error("解析用户数据失败:", e);
      user.value = {
        id: "",
        name: "未命名用户",
        email: "",
        avatar: "",
        avatarColor: "",
        bio: "",
      };
    }
  } else {
    user.value = {
      id: "",
      name: "未命名用户",
      email: "",
      avatar: "",
      avatarColor: "",
      bio: "",
    };
  }
};

const loadUserNews = async () => {
  try {
    isLoading.value = true;
    const response = await getUserNewsList();
    const data = response.data || {};
    userArticle.value = data || [];
    articleList.value = data.list || [];
  } catch (error) {
    console.error("获取用户作品失败:", error);
    articleList.value = [];
  } finally {
    isLoading.value = false;
  }
};

const goToEdit = () => {
  router.push("/profile/edit");
};

const goToSettings = () => {
  showSettingsMenu.value = false;
  router.push("/settings");
};

const goToAbout = () => {
  showSettingsMenu.value = false;
  router.push("/about");
};

const handleLogout = () => {
  if (confirm("确定要退出登录吗?")) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    showSettingsMenu.value = false;
    router.push("/login");
  }
};

const goToFollowing = () => {
  router.push("/profile/following");
};

const goToFollowers = () => {
  router.push("/profile/followers");
};

const goToCollect = () => {
  router.push("/profile/collect");
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  padding-bottom: 70px;
  padding-top: 16px;
}

.main-content {
  min-height: calc(100vh - 120px);
}

.content-container {
  max-width: 750px;
  margin: 0 auto;
  padding: 0 16px 20px;
}

.user-info-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.09);
  position: relative;
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

.settings-icon {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.settings-icon:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: rotate(45deg);
}

.settings-icon svg {
  width: 20px;
  height: 20px;
  color: #667eea;
}

.avatar-wrapper {
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.avatar-wrapper:hover {
  transform: scale(1.05);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea, #764ba2);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  overflow: hidden;
  position: relative;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
  line-height: 1.3;
  cursor: pointer;
  transition: color 0.3s ease;
}

.user-name:hover {
  color: #667eea;
}

.user-email {
  font-size: 13px;
  color: #4a4a4a;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.3s ease;
}

.user-email:hover {
  color: #667eea;
}

.user-email.empty {
  color: #6b7280;
  font-style: italic;
}

.stats-mini-section {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-around;
  gap: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.09);
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s backwards;
}

.stat-mini-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-mini-card.clickable {
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-mini-card.clickable:hover {
  transform: translateY(-2px);
  opacity: 0.8;
}

.stat-mini-card.clickable:active {
  transform: translateY(0);
}

.stat-mini-value {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}

.stat-mini-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.works-section {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.09);
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s backwards;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #202124;
  margin: 0;
}

.works-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.works-header .section-title {
  margin-bottom: 0;
  flex: 1;
}

.works-stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.works-stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #6b7280;
}

.works-stat-item.clickable {
  cursor: pointer;
  transition: all 0.3s ease;
}

.works-stat-item.clickable:hover {
  opacity: 0.7;
}

.works-stat-icon {
  width: 16px;
  height: 16px;
  opacity: 0.7;
}

.works-stat-item span {
  font-weight: 600;
  color: #202124;
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

.info-card {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.98) 100%);
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

.settings-popup {
  background: transparent !important;
}

.settings-content {
  background: white;
  border-radius: 20px 20px 0 0;
  padding: 20px;
}

.settings-title {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #202124;
  margin-bottom: 20px;
}

.settings-item {
  height: 56px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
}

.settings-item:hover {
  background: rgba(102, 126, 234, 0.05);
}

.settings-item.logout-item:hover {
  background: rgba(255, 107, 107, 0.1);
}

.settings-item-icon {
  font-size: 20px;
  line-height: 1;
}

.settings-item-label {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.settings-arrow {
  font-size: 14px;
  color: #6b7280;
  font-weight: 700;
}

.settings-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin: 8px 0;
}

.settings-cancel {
  text-align: center;
  padding: 16px;
  font-size: 16px;
  color: #5f6368;
  border-top: 1px solid #f0f2f5;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  margin-top: 8px;
}

.settings-cancel:hover {
  color: #667eea;
  background: #f8f9fa;
}

@media (max-width: 600px) {
  .content-container {
    padding: 0 12px 16px;
  }

  .user-info-card {
    padding: 20px;
    gap: 16px;
  }

  .avatar {
    width: 70px;
    height: 70px;
    font-size: 32px;
  }

  .user-name {
    font-size: 20px;
  }

  .user-email {
    font-size: 12px;
  }

  .settings-icon {
    width: 32px;
    height: 32px;
  }

  .stats-mini-section {
    padding: 16px 20px;
    gap: 12px;
  }

  .stat-mini-value {
    font-size: 20px;
  }

  .section-title {
    font-size: 16px;
  }

  .works-header {
    padding-bottom: 10px;
    gap: 12px;
  }

  .works-header .section-title {
    font-size: 16px;
  }

  .works-stats {
    gap: 12px;
  }

  .works-stat-item {
    font-size: 12px;
    gap: 3px;
  }

  .works-stat-icon {
    width: 14px;
    height: 14px;
  }

  .works-section {
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
