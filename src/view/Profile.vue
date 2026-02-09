<template>
  <div class="profile-page">
    <div class="main-content">
      <div class="content-container">
        <div class="user-info-card">
          <div class="avatar-wrapper">
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
            <h2 class="user-name">{{ user.name }}</h2>
            <p class="user-email" v-if="user.email">{{ user.email }}</p>
            <p class="user-email empty" v-else>未设置邮箱</p>
            <button class="edit-btn" @click="goToEdit">
              <span class="edit-icon">✏️</span>
              <span class="edit-text">编辑资料</span>
            </button>
          </div>
        </div>

        <div class="stats-section">
          <div class="stats-card" @click="goToWorks">
            <div class="stat-item">
              <span class="stat-icon">📊</span>
              <span class="stat-value">{{
                formatNumber(stats.published)
              }}</span>
              <span class="stat-label">发布</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-icon">👁️</span>
              <span class="stat-value">{{ formatNumber(stats.views) }}</span>
              <span class="stat-label">浏览</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-icon">❤️</span>
              <span class="stat-value">{{ formatNumber(stats.likes) }}</span>
              <span class="stat-label">获赞</span>
            </div>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-card settings-card">
            <div class="menu-item" @click="goToSettings">
              <span class="menu-icon">⚙️</span>
              <span class="menu-label">设置</span>
              <span class="menu-arrow">&gt;</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="menu-card logout-card">
            <div class="menu-item" @click="goToAbout">
              <span class="menu-icon">📝</span>
              <span class="menu-label">关于</span>
              <span class="menu-arrow">&gt;</span>
            </div>
            <div class="divider-line"></div>
            <div class="menu-item logout-item" @click="handleLogout">
              <span class="menu-icon">🚪</span>
              <span class="menu-label">退出登录</span>
              <span class="menu-arrow">&gt;</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BottomTabBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { getUserInfo } from "../api/user.js";
import { getUserNewsList } from "../api/news.js";
import BottomTabBar from "../components/BottomTabBar.vue"; // 引入组件
const VITE_IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL; // 引入环境变量中的API基础地址


const router = useRouter();
// 用户信息列表
const userNews = ref([]);
const user = ref({
  id: null,
  name: "",
  email: "",
  password: "",
  avatar: "",
});

const avatarStyle = computed(() => {
  if (user.value.avatar) {
    return {
      background: "#f0f2f5",
    };
  }
  return {
    background:
      user.value.avatarColor || "linear-gradient(135deg, #667eea, #764ba2)",
  };
});

const stats = ref({
  published: 0,
  views: 0,
  likes: 0,
});

// 格式化数字显示
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};

// 获取统计数据
watch(userNews, (newNews) => {
  const published = newNews.total || 0;
  const views = newNews.totalViews || 0;
  const likes = newNews.totalLikes || 0;
  stats.value = { published, views, likes };
}, { immediate: true });



// 将用户信息合并到 localStorage.user
const updateLocalStorage = (newData) => {
  try {
    const safe = { ...newData };
    // 不要在本地存储敏感信息，比如密码
    if (safe.password !== undefined) delete safe.password;
    localStorage.setItem("user", JSON.stringify(safe));
  } catch (e) {
    console.warn("更新本地用户缓存失败:", e);
  }
};

onMounted(() => {
  loadUserData();
  getUserNews();
});

const loadUserData = async () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      // 先使用本地数据快速渲染
      user.value = {
        id: parsed.id || "",
        name: parsed.name?.trim() || "未命名用户",
        email: parsed.email?.trim() || "",
        password: parsed.password || "",
        avatar: parsed.avatar || "",
      };

      // 异步请求后端获取实时用户信息并更新（若接口可用）
      try {
        const remote = await getUserInfo();

        // 统一处理：优先取 remote.data，如果已经是纯数据则直接用
        const userInfo = remote?.data ?? remote;

        console.log("原始响应:", remote);
        console.log("提取数据:", userInfo);

        if (userInfo) {
          const mappedData = {
            id: userInfo.id || user.value.id,
            name: userInfo.name?.trim() || user.value.name,
            email: (userInfo.email ?? "").trim() || user.value.email,
            password: userInfo.password || user.value.password,
            avatar: userInfo.avatar || user.value.avatar,
          };
          user.value = mappedData;
          // 同步到本地存储（会排除敏感字段）
          updateLocalStorage(mappedData);
        } else {
          console.warn("接口返回空数据或格式不匹配:", remote);
        }
      } catch (error) {
        console.warn("获取远程用户信息失败:", error);
        // 保留本地数据，不做更改
      }
    } catch (e) {
      console.error("解析用户数据失败:", e);
      // 解析失败时使用默认值
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
    // 没有用户数据时使用默认值
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

// 获取用户的发布信息
const getUserNews = async () => {
  try {
    const response = await getUserNewsList();
    userNews.value = response.data || [];
  } catch (error) {
    console.error("获取用户发布信息失败:", error);
    userNews.value = [];
  }
};

const goToHome = () => {
  router.push("/index");
};

const goToEdit = () => {
  router.push("/profile/edit");
};

const goToWorks = () => {
  router.push("/profile/articlestats");
};

const goToSettings = () => {
  router.push("/settings");
};

const goToAbout = () => {
  router.push("/about");
};

const handleLogout = () => {
  if (confirm("确定要退出登录吗？")) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  }
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
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
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

.avatar-wrapper {
  flex-shrink: 0;
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
}

.user-email {
  font-size: 13px;
  color: #4a4a4a;
  margin-bottom: 12px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-email.empty {
  color: #6b7280;
  font-style: italic;
}

.edit-btn {
  padding: 8px 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  gap: 6px;
}

.edit-icon {
  font-size: 14px;
  line-height: 1;
}

.edit-text {
  font-size: 13px;
  font-weight: 500;
}

.edit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.edit-btn:active {
  transform: translateY(0) scale(0.98);
}

.stats-section {
  margin-bottom: 16px;
}

.stats-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 16px;
  padding: 24px;
  display: grid;
  /* item | divider | item | divider | item - 确保三项水平居中对齐 */
  grid-template-columns: 1fr 1px 1fr 1px 1fr;
  align-items: center;
  column-gap: 16px;
  row-gap: 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.09);
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s backwards;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: transform 0.2s ease;
}

.stat-item:hover {
  transform: scale(1.05);
}

.stat-icon {
  font-size: 32px;
  margin-bottom: 8px;
  line-height: 1;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.stat-divider {
  width: 1px;
  background: rgba(0, 0, 0, 0.06);
  height: 40px;
  justify-self: center;
  align-self: center;
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s backwards;
}

.menu-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.09);
}

.settings-card {
  margin-bottom: 12px;
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s backwards;
}

.logout-card {
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s backwards;
}

.menu-item {
  background: transparent;
  height: 56px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.menu-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.05),
    rgba(118, 75, 162, 0.05)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.menu-item:hover::before {
  opacity: 1;
}

.menu-item:hover {
  transform: translateY(0);
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.05),
    rgba(118, 75, 162, 0.05)
  );
}

.menu-item:active {
  transform: scale(0.98);
  transition: transform 0.1s;
}

.menu-item.logout-item:hover {
  background: rgba(255, 107, 107, 0.1);
}

.menu-icon {
  font-size: 22px;
  line-height: 1;
}

.menu-label {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: 0.3px;
}

.menu-arrow {
  font-size: 14px;
  color: #6b7280;
  font-weight: 700;
  transition: transform 0.2s ease;
}

.menu-item:hover .menu-arrow {
  transform: translateX(3px);
  color: #667eea;
}

.divider-line {
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
}

.divider {
  height: 12px;
}


.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.tab-item::before {
  content: "";
  position: absolute;
  top: -2px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 40px;
  height: 3px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 0 0 3px 3px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-item.active::before {
  transform: translateX(-50%) scaleX(1);
}

.tab-icon {
  font-size: 24px;
  transition: all 0.3s ease;
  filter: grayscale(1) opacity(0.6);
}

.tab-item.active .tab-icon {
  filter: grayscale(0) opacity(1);
  transform: scale(1.08);
}

.tab-label {
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tab-item.active .tab-label {
  color: #667eea;
  font-weight: 600;
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

  /* 移动端：使用三列布局并隐藏分隔线以避免拥挤 */
  .stats-card {
    padding: 18px;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .stat-divider {
    display: none;
  }

  .stat-icon {
    font-size: 28px;
  }

  .stat-value {
    font-size: 20px;
  }

  .stat-label {
    font-size: 11px;
  }

  .menu-item {
    height: 54px;
    padding: 0 16px;
    border-radius: 14px;
  }

  .menu-icon {
    font-size: 20px;
  }

  .menu-label {
    font-size: 14px;
  }
}
</style>
