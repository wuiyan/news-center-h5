<template>
  <div class="bottom-tab-bar-wrapper">
    <div class="bottom-tab-bar">
      <!-- 首页 -->
      <div
        class="tab-item"
        :class="{ active: activeTab === 'home' }"
        @click="switchTab('home')"
      >
        <span class="tab-icon">🏠</span>
        <span class="tab-label">首页</span>
      </div>

      <!-- 发布按钮（突出显示） -->
      <div class="publish-tab-item" @click="handlePublish">
        <div class="publish-btn">
          <svg class="publish-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </div>
        <span class="tab-label publish-label">发布</span>
      </div>

      <!-- 我的 -->
      <div
        class="tab-item"
        :class="{ active: activeTab === 'profile' }"
        @click="switchTab('profile')"
      >
        <span class="tab-icon">👤</span>
        <span class="tab-label">我的</span>
      </div>
    </div>
    
    <!-- 安全区域填充 -->
    <div class="safe-area-fill"></div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const route = useRoute();

// 根据当前路由自动判断激活状态
const activeTab = computed(() => {
  const path = route.path;
  if (path === '/' || path === '/index' || path.includes('index')) {
    return 'home';
  } else if (path.includes('profile') || path.includes('my')) {
    return 'profile';
  }
  return 'home';
});

// 切换标签
const switchTab = (tab) => {
  if (tab === 'home') {
    router.push('/index');
  } else if (tab === 'profile') {
    router.push('/profile');
  }
};

// 发布按钮点击
const handlePublish = () => {
  router.push('/publish');
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 外层包装器 - 关键修复：使用 transform 创建独立合成层 */
.bottom-tab-bar-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  /* 关键：强制硬件加速，防止滚动时抖动 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  perspective: 1000;
  -webkit-perspective: 1000;
  /* 防止 iOS 橡皮筋效果影响 */
  pointer-events: auto;
}

.bottom-tab-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.12);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: 8px 0;
  height: 64px;
  /* 确保自身也是独立层 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

/* 安全区域填充 - 单独处理避免影响主栏高度 */
.safe-area-fill {
  height: env(safe-area-inset-bottom);
  background: rgba(255, 255, 255, 0.98);
  /* iOS 底部横条区域 */
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
}

/* 普通标签项 */
.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 0;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  /* 防止子元素引起重绘 */
  transform: translateZ(0);
}

.tab-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 40px;
  height: 3px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 0 0 3px 3px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  /* 防止动画引起重排 */
  will-change: transform;
}

.tab-item.active::before {
  transform: translateX(-50%) scaleX(1);
}

.tab-icon {
  font-size: 24px;
  transition: all 0.3s ease;
  filter: grayscale(1) opacity(0.6);
  /* 防止emoji渲染抖动 */
  transform: translateZ(0);
}

.tab-item.active .tab-icon {
  filter: grayscale(0) opacity(1);
  transform: scale(1.08) translateZ(0);
}

.tab-label {
  font-size: 11px;
  color: #9aa0a6;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tab-item.active .tab-label {
  color: #667eea;
  font-weight: 600;
}

/* 发布按钮特殊样式 - 凸起效果 */
.publish-tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  margin-top: -20px;
  padding: 0 12px;
  /* 防止浮动元素抖动 */
  transform: translateZ(0);
  will-change: transform;
}

.publish-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 4px 16px rgba(102, 126, 234, 0.5), 
    0 2px 8px rgba(0, 0, 0, 0.2),
    0 0 0 4px rgba(255, 255, 255, 0.8); /* 白色描边融入背景 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  /* 硬件加速 */
  transform: translateZ(0);
  will-change: transform;
}

/* 内部光晕效果 */
.publish-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s ease;
}

.publish-tab-item:hover .publish-btn {
  transform: translateY(-4px) scale(1.05) translateZ(0);
  box-shadow: 
    0 6px 24px rgba(102, 126, 234, 0.6), 
    0 4px 12px rgba(0, 0, 0, 0.25),
    0 0 0 4px rgba(255, 255, 255, 0.8);
}

.publish-tab-item:hover .publish-btn::before {
  left: 100%;
}

.publish-tab-item:active .publish-btn {
  transform: translateY(-2px) scale(0.95) translateZ(0);
  transition: transform 0.1s;
}

.publish-icon {
  width: 26px;
  height: 26px;
  color: white;
  stroke-linecap: round;
  stroke-linejoin: round;
  /* 防止SVG抖动 */
  transform: translateZ(0);
}

.publish-label {
  margin-top: 6px;
  color: #667eea;
  font-weight: 600;
  font-size: 11px;
}

/* 响应式适配 */
@media (max-width: 600px) {
  .bottom-tab-bar {
    height: 60px;
    padding: 6px 0;
  }

  .tab-icon {
    font-size: 22px;
  }

  .publish-btn {
    width: 52px;
    height: 52px;
  }

  .publish-icon {
    width: 24px;
    height: 24px;
  }

  .publish-tab-item {
    margin-top: -16px;
  }
}

/* iOS 特定修复 */
@supports (-webkit-touch-callout: none) {
  .bottom-tab-bar-wrapper {
    /* iOS 底部固定栏特殊处理 */
    position: fixed;
    bottom: 0;
    /* 防止 iOS 键盘弹出时的布局错乱 */
    transform: translateZ(0) translateY(0);
  }
}

/* Android 特定修复 */
@media screen and (prefers-color-scheme: dark) {
  .bottom-tab-bar,
  .safe-area-fill {
    background: rgba(30, 30, 30, 0.98);
    border-top-color: rgba(255, 255, 255, 0.1);
  }
}
</style>