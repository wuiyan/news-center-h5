<template>
  <div class="followers-page">
    <div class="header">
      <div class="back-btn" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </div>
      <h1 class="title">我的粉丝</h1>
    </div>

    <div class="content">
      <van-overlay :show="isLoading" class-name="loading-overlay">
        <div class="loading-wrapper">
          <van-loading type="spinner" color="#1989fa" size="40px" />
          <span class="loading-text">加载中...</span>
        </div>
      </van-overlay>

      <div class="empty-state" v-if="followersList.length === 0 && !isLoading">
        <div class="empty-icon">👤</div>
        <p class="empty-text">暂无粉丝</p>
      </div>

      <div v-else class="user-list">
        <div v-for="user in followersList" :key="user.id" class="user-item">
          <div class="user-avatar" :style="{ background: user.avatarColor || 'linear-gradient(135deg, #667eea, #764ba2)' }">
            <img v-if="user.avatar" :src="user.avatar.startsWith('data:') ? user.avatar : VITE_IMAGE_BASE_URL + user.avatar" :alt="user.name" class="avatar-img" />
            <span v-else>{{ (user.name || "未命名用户").charAt(0) }}</span>
          </div>
          <div class="user-info">
            <h3 class="user-name">{{ user.name }}</h3>
          </div>
          <div class="action-btn follow-btn" @click="handleFollow(user.id)">
            关注
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getFollowersList, followUser } from "../../api/user.js";
import { showToast } from 'vant';

const VITE_IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const router = useRouter();

const isLoading = ref(false);
const followersList = ref([]);

const loadFollowersList = async () => {
  try {
    isLoading.value = true;
    const response = await getFollowersList();
    followersList.value = response.data.list || [];
  } catch (error) {
    console.error("获取粉丝列表失败:", error);
    showToast("加载失败，请重试");
    followersList.value = [];
  } finally {
    isLoading.value = false;
  }
};

const handleFollow = async (userId) => {
  try {
    await followUser(userId);
    showToast("已关注");
    loadFollowersList();
  } catch (error) {
    console.error("关注失败:", error);
    showToast("操作失败，请重试");
  }
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  loadFollowersList();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.followers-page {
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

.user-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  color: white;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.user-email {
  font-size: 13px;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.follow-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.follow-btn:hover {
  opacity: 0.9;
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

  .user-avatar {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .user-name {
    font-size: 15px;
  }

  .user-email {
    font-size: 12px;
  }
}
</style>
