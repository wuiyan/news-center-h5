<template>
  <div class="settings-page">
    <div class="page-container">
      <div class="nav-header">
        <button class="back-btn" @click="goBack">
          <span class="back-icon">←</span>
        </button>
        <h1 class="page-title">设置</h1>
      </div>

      <div class="content-scroll">
        <div class="menu-group white-card">
          <div class="card-group-header">通用设置</div>
          <div class="menu-item">
            <span class="menu-icon">🌙</span>
            <span class="menu-label">深色模式</span>
            <div class="switch-wrapper">
              <div class="toggle-switch" :class="{ active: settings.darkMode }" @click="toggleDarkMode">
                <div class="toggle-slider"></div>
              </div>
            </div>
          </div>
          <div class="menu-item">
            <span class="menu-icon">🔔</span>
            <span class="menu-label">消息通知</span>
            <div class="switch-wrapper">
              <div class="toggle-switch" :class="{ active: settings.notifications }" @click="toggleNotifications">
                <div class="toggle-slider"></div>
              </div>
            </div>
          </div>
          <div class="menu-item" @click="goToPrivacy">
            <span class="menu-icon">🔒</span>
            <span class="menu-label">隐私设置</span>
            <span class="menu-arrow">&gt;</span>
          </div>
        </div>

        <div class="menu-group white-card">
          <div class="card-group-header">账号安全</div>
          <div class="menu-item" @click="goToChangePassword">
            <span class="menu-icon">🔑</span>
            <span class="menu-label">修改密码</span>
            <span class="menu-arrow">&gt;</span>
          </div>
          <div class="menu-item" @click="goToBindPhone">
            <span class="menu-icon">📱</span>
            <span class="menu-label">绑定手机</span>
            <span class="menu-arrow">&gt;</span>
          </div>
          <div class="menu-item" @click="goToBindEmail">
            <span class="menu-icon">📧</span>
            <span class="menu-label">绑定邮箱</span>
            <span class="menu-arrow">&gt;</span>
          </div>
        </div>

        <div class="menu-group white-card">
          <div class="card-group-header">其他</div>
          <div class="menu-item" @click="clearCache">
            <span class="menu-icon">🧹</span>
            <span class="menu-label">清除缓存</span>
            <span class="menu-arrow">&gt;</span>
          </div>
          <div class="menu-item">
            <span class="menu-icon">📦</span>
            <span class="menu-label">当前版本</span>
            <span class="version-tag">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showConfirmDialog } from 'vant';

const router = useRouter();

const settings = ref({
  darkMode: false,
  notifications: true
});

onMounted(() => {
  loadSettings();
});

const loadSettings = () => {
  const savedSettings = localStorage.getItem('userSettings');
  if (savedSettings) {
    try {
      settings.value = JSON.parse(savedSettings);
    } catch (e) {
      console.error('解析设置失败:', e);
    }
  }
};

const saveSettings = () => {
  localStorage.setItem('userSettings', JSON.stringify(settings.value));
};

const toggleDarkMode = () => {
  settings.value.darkMode = !settings.value.darkMode;
  saveSettings();
  showToast(settings.value.darkMode ? '已开启深色模式' : '已关闭深色模式');
};

const toggleNotifications = () => {
  settings.value.notifications = !settings.value.notifications;
  saveSettings();
  showToast(settings.value.notifications ? '已开启消息通知' : '已关闭消息通知');
};

const goBack = () => {
  router.back();
};

const goToPrivacy = () => {
  showToast('隐私设置功能开发中');
};

const goToChangePassword = () => {
  showToast('修改密码功能开发中');
};

const goToBindPhone = () => {
  showToast('绑定手机功能开发中');
};

const goToBindEmail = () => {
  showToast('绑定邮箱功能开发中');
};

const clearCache = () => {
  showConfirmDialog({
    title: '清除缓存',
    message: '确定要清除所有缓存数据吗？',
  })
    .then(() => {
      showToast('缓存已清除');
    })
    .catch(() => {
    });
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.settings-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  padding-bottom: 20px;
}

.page-container {
  max-width: 750px;
  margin: 0 auto;
}

.nav-header {
  position: sticky;
  top: 0;
  z-index: 101;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-btn:hover {
  background: rgba(102, 126, 234, 0.1);
}

.back-btn:active {
  transform: scale(0.95);
}

.back-icon {
  font-size: 20px;
  color: #202124;
  font-weight: 600;
}

.page-title {
  font-size: 18px;
  font-weight: 700;
  color: #202124;
}

.content-scroll {
  padding: 16px;
}

.section-header {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  padding-left: 8px;
  font-weight: 500;
}

.menu-group {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 24px;
}

/* 白底卡片样式，专用于分组 */
.menu-group.white-card {
  background: rgba(255, 255, 255, 0.98);
  padding: 8px 0; /* 给菜单项一些内边距 */
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.menu-group.white-card .card-group-header {
  padding: 12px 16px;
  font-size: 13px;
  color: #666;
  font-weight: 600;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}

/* 去掉白底卡片内的分隔线样式，让每项更清晰 */
.menu-group.white-card .menu-item {
  background: transparent;
}

.menu-group.white-card .menu-item + .menu-item {
  border-top: 1px solid rgba(0,0,0,0.06);
}

.menu-item {
  height: 52px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.menu-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
}

.menu-item:last-child::after {
  display: none;
}

.menu-item:hover {
  background: rgba(102, 126, 234, 0.05);
}

.menu-item:active {
  background: rgba(102, 126, 234, 0.1);
}

.menu-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.menu-label {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: #202124;
}

.menu-arrow {
  font-size: 14px;
  color: #9aa0a6;
  font-weight: 600;
}

.switch-wrapper {
  display: flex;
  align-items: center;
}

.toggle-switch {
  position: relative;
  width: 48px;
  height: 28px;
  background: #e0e0e0;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-switch.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-switch.active .toggle-slider {
  left: 22px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}

.version-tag {
  padding: 4px 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 10px;
}

@media (max-width: 600px) {
  .content-scroll {
    padding: 12px;
  }

  .section-header {
    font-size: 12px;
    margin-bottom: 6px;
  }

  .menu-item {
    height: 50px;
    padding: 0 14px;
  }

  .menu-item::after {
    left: 14px;
    right: 14px;
  }

  .menu-label {
    font-size: 14px;
  }

  .toggle-switch {
    width: 44px;
    height: 26px;
  }

  .toggle-slider {
    width: 22px;
    height: 22px;
  }

  .toggle-switch.active .toggle-slider {
    left: 20px;
  }
}
</style>
