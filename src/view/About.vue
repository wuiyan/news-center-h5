<template>
  <div class="about-page">
    <div class="page-container">
      <div class="nav-header">
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
        <h1 class="page-title">关于</h1>
      </div>

      <div class="content-scroll">
        <div class="about-card">
          <div class="app-icon">📖</div>
          <h2 class="app-name">News Center</h2>
          <div class="app-info">
            <div class="info-row">
              <span class="info-label">版本号</span>
              <span class="info-value">v1.0.0</span>
            </div>
            <div class="info-row">
              <span class="info-label">更新时间</span>
              <span class="info-value">2026-02-05</span>
            </div>
          </div>
        </div>

        <div class="menu-group">
          <div class="menu-item" @click="goToUserAgreement">
            <span class="menu-icon">📄</span>
            <span class="menu-label">用户协议</span>
            <span class="menu-arrow">&gt;</span>
          </div>
          <div class="menu-item" @click="goToPrivacyPolicy">
            <span class="menu-icon">🔒</span>
            <span class="menu-label">隐私政策</span>
            <span class="menu-arrow">&gt;</span>
          </div>
          <div class="menu-item" @click="goToContact">
            <span class="menu-icon">📧</span>
            <span class="menu-label">联系我们</span>
            <span class="menu-arrow">&gt;</span>
          </div>
          <div class="menu-item" @click="goToRate">
            <span class="menu-icon">⭐</span>
            <span class="menu-label">给我们好评</span>
            <span class="menu-arrow">&gt;</span>
          </div>
          <div class="menu-item" @click="checkUpdate">
            <span class="menu-icon">📤</span>
            <span class="menu-label">检查更新</span>
            <span class="menu-arrow">&gt;</span>
          </div>
        </div>

        <div class="footer-text">
          © 2026 News Center. All rights reserved
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();

const goBack = () => {
  router.back();
};

const goToUserAgreement = () => {
  showToast('用户协议功能开发中');
};

const goToPrivacyPolicy = () => {
  showToast('隐私政策功能开发中');
};

const goToContact = () => {
  showToast('联系我们功能开发中');
};

const goToRate = () => {
  showToast('请到应用商店给我们评价');
};

const checkUpdate = () => {
  showToast('当前已是最新版本');
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.about-page {
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
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(102, 126, 234, 0.1);
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

.page-title {
  font-size: 18px;
  font-weight: 700;
  color: #202124;
}

.content-scroll {
  padding: 16px;
}

.about-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 20px;
  padding: 32px 24px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
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

.app-icon {
  font-size: 56px;
  margin-bottom: 16px;
}

.app-name {
  font-size: 24px;
  font-weight: 700;
  color: #202124;
  margin-bottom: 24px;
}

.app-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
}

.info-label {
  font-size: 14px;
  color: #5f6368;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #202124;
  font-weight: 600;
}

.menu-group {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 24px;
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s backwards;
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

.footer-text {
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  padding: 0 16px;
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s backwards;
}

@media (max-width: 600px) {
  .content-scroll {
    padding: 12px;
  }

  .about-card {
    padding: 28px 20px;
    border-radius: 18px;
  }

  .app-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  .app-name {
    font-size: 22px;
    margin-bottom: 20px;
  }

  .info-row {
    padding: 10px 14px;
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
}
</style>
