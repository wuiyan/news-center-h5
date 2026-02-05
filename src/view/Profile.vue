<template>
  <div class="profile-page">
    <div class="main-content">
      <div class="content-container">
        <div class="user-info-card">
          <div class="avatar-wrapper">
            <div class="avatar" :style="avatarStyle">
              <template v-if="user.avatarUrl">
                <img :src="user.avatarUrl" :alt="user.name" class="avatar-img" />
              </template>
              <template v-else>
                {{ (user.name || '未命名用户').charAt(0) }}
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
          <div class="stats-card">
            <div class="stat-item">
              <span class="stat-icon">📊</span>
              <span class="stat-value">{{ formatNumber(stats.published) }}</span>
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

          <div class="menu-card">
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

    <div class="bottom-tab-bar">
      <div class="tab-item" @click="goToHome">
        <span class="tab-icon">🏠</span>
        <span class="tab-label">首页</span>
      </div>
      <div class="tab-item active">
        <span class="tab-icon">👤</span>
        <span class="tab-label">我的</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const user = ref({
  name: '',
  email: '',
  avatarUrl: '',
  avatarColor: '',
  bio: ''
});

const avatarStyle = computed(() => {
  if (user.value.avatarUrl) {
    return {
      background: '#f0f2f5'
    };
  }
  return {
    background: user.value.avatarColor || 'linear-gradient(135deg, #667eea, #764ba2)'
  };
});

const stats = ref({
  published: 0,
  views: 0,
  likes: 0
});

// 格式化数字显示
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

// 获取统计数据
const loadStatsData = () => {
  const statsData = localStorage.getItem('userStats');
  if (statsData) {
    try {
      const parsed = JSON.parse(statsData);
      stats.value = {
        published: parsed.published || 0,
        views: parsed.views || 0,
        likes: parsed.likes || 0
      };
    } catch (e) {
      console.error('解析统计数据失败:', e);
      // 保持默认值 0
    }
  } else {
    // 如果没有统计数据，设置为 0
    stats.value = {
      published: 0,
      views: 0,
      likes: 0
    };
  }
};

// 更新统计数据（可以调用此方法来更新统计数据）
const updateStats = (newStats) => {
  stats.value = {
    published: newStats.published || stats.value.published,
    views: newStats.views || stats.value.views,
    likes: newStats.likes || stats.value.likes
  };
  localStorage.setItem('userStats', JSON.stringify(stats.value));
};

onMounted(() => {
  loadUserData();
  loadStatsData();
});

const loadUserData = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      // 验证并设置用户数据，使用默认值防止空数据显示
      user.value = {
        name: parsed.name?.trim() || '未命名用户',
        email: parsed.email?.trim() || '',
        avatarUrl: parsed.avatarUrl?.trim() || '',
        avatarColor: parsed.avatarColor?.trim() || '',
        bio: parsed.bio?.trim() || ''
      };
    } catch (e) {
      console.error('解析用户数据失败:', e);
      // 解析失败时使用默认值
      user.value = {
        name: '未命名用户',
        email: '',
        avatarUrl: '',
        avatarColor: '',
        bio: ''
      };
    }
  } else {
    // 没有用户数据时使用默认值
    user.value = {
      name: '未命名用户',
      email: '',
      avatarUrl: '',
      avatarColor: '',
      bio: ''
    };
  }
};

const goToHome = () => {
  router.push('/index');
};

const goToEdit = () => {
  router.push('/profile/edit');
};

const goToSettings = () => {
  router.push('/settings');
};

const goToAbout = () => {
  router.push('/about');
};

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
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
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.06),
    0 2px 6px rgba(0, 0, 0, 0.09);
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
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.06),
    0 2px 6px rgba(0, 0, 0, 0.09);
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
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.06),
    0 2px 6px rgba(0, 0, 0, 0.09);
}

.settings-card {
  margin-bottom: 12px;
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
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.menu-item:hover::before {
  opacity: 1;
}

.menu-item:hover {
  transform: translateY(0);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
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

.bottom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.08);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
  min-height: 60px;
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
  content: '';
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
