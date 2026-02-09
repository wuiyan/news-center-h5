<template>
  <div class="detail-page">
    <!-- 顶部导航栏 -->
    <div class="detail-header">
      <div class="back-btn">
        <svg
          class="back-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          @click="goBack"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </div>
      <div class="header-title">资讯详情</div>
      <div class="header-right">
        <svg
          class="share-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          @click="toggleShare"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
        </svg>
      </div>
    </div>

    <!-- 主体内容区 -->
    <div class="detail-content">
      <div class="content-wrapper">
        <!-- 标题区 -->
        <div class="title-section">
          <!-- 用户信息区域 -->
          <div class="user-info-row">
            <img
              v-if="detail.userAvatar"
              :src="getUserAvatar()"
              :alt="detail.userName"
              class="author-avatar"
              @error="handleAvatarError"
              @click="goToUserDetail"
            />
            <div v-else class="avatar-placeholder" @click="goToUserDetail">{{ (detail.userName || '匿名').charAt(0) }}</div>
            <span class="author-name">{{ detail.userName || '匿名用户' }}</span>
            <button
              class="follow-btn"
              :class="{ following: isFollowing }"
              @click="toggleFollow"
            >
              {{ isFollowing ? '已关注' : '+ 关注' }}
            </button>
          </div>

          <h1 class="detail-title">{{ detail.title }}</h1>
          <div class="meta-info">
            <div
              class="category-tag"
              :style="{ background: getCategoryColor(detail.category) }"
            >
              {{ getCategoryName(detail.category) }}
            </div>
            <span class="dot-separator">·</span>
            <span class="view-count">{{ detail.viewCount || detail.views || 0 }} 阅读</span>
          </div>
        </div>

        <!-- 图片展示区 -->
        <div v-if="imageList.length > 0" class="gallery-section">
          <!-- 单图模式 -->
          <div v-if="imageList.length === 1" class="single-image-wrapper">
            <img
              :src="imageList[0]"
              class="detail-image"
              @click="previewImage(0)"
              alt="详情图片"
            />
          </div>

          <!-- 多图轮播模式 -->
          <div v-else class="image-carousel">
            <div class="carousel-container" ref="carouselRef">
              <div
                v-for="(img, index) in imageList"
                :key="index"
                class="carousel-item"
                :style="{ transform: `translateX(${-currentIndex * 100}%)` }"
              >
                <img
                  :src="img"
                  class="carousel-image"
                  @click="previewImage(index)"
                  alt="详情图片"
                />
              </div>
            </div>

            <!-- 指示器 -->
            <div class="carousel-indicators">
              <span
                v-for="(_, index) in imageList"
                :key="index"
                class="indicator-dot"
                :class="{ active: currentIndex === index }"
                @click="goToSlide(index)"
              />
            </div>

            <!-- 计数器 -->
            <div class="image-counter">
              {{ currentIndex + 1 }} / {{ imageList.length }}
            </div>
          </div>
        </div>

        <!-- 内容区 -->
        <div class="article-content" v-html="formattedContent"></div>

        <!-- 发布时间 -->
        <div class="article-publish-time">
          {{ formatDate(detail.publishTime) }}
        </div>

        <!-- 底部操作栏 -->
        <div class="action-bar">
          <div
            class="action-item"
            :class="{ active: hasLiked }"
            @click="toggleLike"
          >
            <div
              class="action-icon-wrapper"
              :class="{ 'like-anim': likeAnimating }"
            >
              <svg
                class="action-icon"
                viewBox="0 0 24 24"
                :fill="hasLiked ? 'currentColor' : 'none'"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
            </div>
            <span class="action-count">{{ likeCount }}</span>
            <span class="action-label">点赞</span>
          </div>

          <div class="action-item" @click="focusComment">
            <div class="action-icon-wrapper">
              <svg
                class="action-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                />
              </svg>
            </div>
            <span class="action-count">{{ detail.comments || 0 }}</span>
            <span class="action-label">评论</span>
          </div>

          <div class="action-item" @click="toggleCollect">
            <div
              class="action-icon-wrapper"
              :class="{ 'collect-anim': collectAnimating }"
            >
              <svg
                class="action-icon"
                viewBox="0 0 24 24"
                :fill="hasCollected ? 'currentColor' : 'none'"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span class="action-label">{{
              hasCollected ? "已收藏" : "收藏"
            }}</span>
          </div>
        </div>
      </div>

      <!-- 评论区 -->
      <div class="comments-section">
        <div class="section-header">
          <h3 class="section-title">
            评论区
            <span class="comment-count">({{ commentList.length }})</span>
          </h3>
          <div class="sort-tabs">
            <span
              v-for="tab in sortTabs"
              :key="tab.value"
              class="sort-tab"
              :class="{ active: currentSort === tab.value }"
              @click="currentSort = tab.value"
            >
              {{ tab.label }}
            </span>
          </div>
        </div>

        <!-- 评论输入框 -->
        <div class="comment-input-area" id="commentInput">
          <div class="input-wrapper">
            <input
              v-model="newComment"
              type="text"
              placeholder="写下你的评论..."
              class="comment-input"
              @keyup.enter="submitComment"
            />
            <button
              class="submit-btn"
              :class="{ active: newComment.trim() }"
              @click="submitComment"
              :disabled="!newComment.trim()"
            >
              发送
            </button>
          </div>
        </div>

        <!-- 评论列表 -->
        <div class="comments-list">
          <div
            v-for="comment in sortedComments"
            :key="comment.id"
            class="comment-item"
          >
            <img :src="comment.avatar" class="comment-avatar" alt="头像" />
            <div class="comment-body">
              <div class="comment-header">
                <span class="comment-author">{{ comment.author }}</span>
                <span class="comment-time">{{ comment.time }}</span>
              </div>
              <p class="comment-text">{{ comment.content }}</p>
              <div class="comment-actions">
                <span
                  class="comment-action"
                  :class="{ active: comment.isLiked }"
                  @click="toggleCommentLike(comment)"
                >
                  <svg
                    class="action-icon-small"
                    viewBox="0 0 24 24"
                    :fill="comment.isLiked ? 'currentColor' : 'none'"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    />
                  </svg>
                  {{ comment.likes || "赞" }}
                </span>
                <span class="comment-action" @click="replyTo(comment)">
                  <svg
                    class="action-icon-small"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                    />
                  </svg>
                  回复
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div v-if="hasMoreComments" class="load-more" @click="loadMoreComments">
          <span v-if="!loadingMore">加载更多评论</span>
          <van-loading v-else type="spinner" size="16px" color="#667eea" />
        </div>
      </div>
    </div>

    <!-- 分享弹窗 -->
    <van-popup
      v-model:show="showSharePopup"
      position="bottom"
      round
      class="share-popup"
    >
      <div class="share-sheet">
        <h4 class="share-title">分享到</h4>
        <div class="share-options">
          <div
            class="share-option"
            v-for="option in shareOptions"
            :key="option.name"
            @click="handleShare(option)"
          >
            <div class="share-icon-bg" :style="{ background: option.color }">
              <span class="share-icon-text">{{ option.icon }}</span>
            </div>
            <span class="share-label">{{ option.name }}</span>
          </div>
        </div>
        <div class="share-cancel" @click="showSharePopup = false">取消</div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { showToast, showImagePreview } from "vant";
import { getNewsDetail, likeNews, collectNews } from "../api/news";

const router = useRouter();
const route = useRoute();
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

// 详情数据
const detail = ref({
  id: 1,
  category: "",
  title: "",
  summary: "",
  content: "",
  views: 0,
  comments: 328,
  likes: 0,
  isLiked: false,
  isCollected: false,
  publishTime: "",
  cover:"",
});

onMounted(() => {
  // 通过Id来获取详情数据
  const id = route.query.id;
  console.log("获取详情数据，ID:", id);
  fetchNewsDetail(id);
});

const fetchNewsDetail = async (id) => {
  try {
    const response = await getNewsDetail(id);
    detail.value = response.data;
  } catch (error) {
    console.error("获取详情失败:", error);
    showToast("无法获取资讯详情，请稍后再试。");
  }
};

// 图片处理
const imageList = computed(() => {
  if (!detail.value?.cover) return [];
  
  // 处理逗号分隔的字符串
  let urls = [];
  
  if (Array.isArray(detail.value.cover)) {
    urls = detail.value.cover;
  } else if (typeof detail.value.cover === 'string') {
    urls = detail.value.cover.split(',').map(url => url.trim()).filter(Boolean);
  }
  
  // 转换为完整URL
  return urls.map(url => {
    // 已经是完整URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // 拼接基础URL
    const baseUrl = IMAGE_BASE_URL.replace(/\/$/, '');
    const path = url.startsWith('/') ? url : `/${url}`;
    console.log(baseUrl,path);
    
    return `${baseUrl}${path}`;
  });
});

// 格式化内容（简单处理，实际项目可能需要更复杂的富文本处理）
const formattedContent = computed(() => {
  return detail.value.content?.replace(/\n/g, "<br>") || "";
});

// 轮播图状态
const currentIndex = ref(0);
const carouselRef = ref(null);
let autoplayTimer = null;

// 分类颜色映射（与Index.vue保持一致）
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

// 获取用户头像
const getUserAvatar = () => {
  if (!detail.value?.userAvatar) return null;

  let avatarUrl = detail.value.userAvatar;

  // 如果已经是完整URL，直接返回
  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
    return avatarUrl;
  }

  // 拼接基础URL
  const baseUrl = IMAGE_BASE_URL.replace(/\/$/, '');
  const path = avatarUrl.startsWith('/') ? avatarUrl : `/${avatarUrl}`;

  return `${baseUrl}${path}`;
};

// 头像加载失败处理
const handleAvatarError = (e) => {
  e.target.style.display = 'none';
};

// 切换关注状态
const toggleFollow = () => {
  isFollowing.value = !isFollowing.value;
  showToast(isFollowing.value ? '关注成功' : '已取消关注');
};

// 跳转到用户详情页
const goToUserDetail = () => {
  const userName = detail.value.userName;
  const userAvatar = detail.value.userAvatar;

  router.push({
    path: '/user/detail',
    query: {
      userName: userName,
      userAvatar: userAvatar
    }
  });
};

// 轮播控制
const goToSlide = (index) => {
  currentIndex.value = index;
  resetAutoplay();
};

const nextSlide = () => {
  if (currentIndex.value < imageList.value.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0;
  }
};

const startAutoplay = () => {
  autoplayTimer = setInterval(nextSlide, 4000);
};

const resetAutoplay = () => {
  clearInterval(autoplayTimer);
  startAutoplay();
};

// 图片预览
const previewImage = (index) => {
  showImagePreview({
    images: imageList.value,
    startPosition: index,
    closeable: true,
  });
};

// 互动状态
const hasLiked = ref(false);
const likeCount = ref(0);
const hasCollected = ref(false);
const likeAnimating = ref(false);
const collectAnimating = ref(false);
const isFollowing = ref(false);

watch(
  () => detail.value,
  (newDetail) => {
    if (!newDetail) return;

    hasLiked.value = newDetail.isLiked || false;
    likeCount.value = parseFloat(newDetail.likes) || 0;
    hasCollected.value = newDetail.isCollected || false; // ← 同步收藏状态
  },
  { immediate: true, deep: true }
);

const toggleLike = async () => {
  likeAnimating.value = true;
  setTimeout(() => (likeAnimating.value = false), 300);

  const likedStatus = await likeNews(detail.value.id);
  console.log(likedStatus);

  if (hasLiked.value) {
    likeCount.value--;
    hasLiked.value = false;
  } else {
    likeCount.value++;
    hasLiked.value = true;
    showToast("点赞成功");
  }
};

const toggleCollect = async () => {
  collectAnimating.value = true;
  setTimeout(() => (collectAnimating.value = false), 300);

  const collectStatus = await collectNews(detail.value.id);
  console.log(collectStatus);

  hasCollected.value = !hasCollected.value;
  showToast(hasCollected.value ? "收藏成功" : "已取消收藏");
};

// 分享功能
const showSharePopup = ref(false);
const shareOptions = [
  { name: "微信", icon: "💬", color: "#07C160" },
  { name: "朋友圈", icon: "📱", color: "#07C160" },
  { name: "微博", icon: "🌊", color: "#E6162D" },
  { name: "复制链接", icon: "🔗", color: "#667eea" },
];

const toggleShare = () => {
  showSharePopup.value = true;
};

const handleShare = (option) => {
  showToast(`已分享到${option.name}`);
  showSharePopup.value = false;
};

// 评论区
const newComment = ref("");
const currentSort = ref("hot");
const sortTabs = [
  { label: "热门", value: "hot" },
  { label: "最新", value: "new" },
];

const commentList = ref([
  {
    id: 1,
    author: "科技爱好者",
    avatar: "https://picsum.photos/100/100?random=10",
    content: "这个模型看起来很强啊，期待实际应用效果！",
    time: "10分钟前",
    likes: 23,
    isLiked: false,
  },
  {
    id: 2,
    author: "AI研究员",
    avatar: "https://picsum.photos/100/100?random=11",
    content: "技术架构确实有创新，不过在安全性方面还需要更多验证。",
    time: "25分钟前",
    likes: 15,
    isLiked: true,
  },
  {
    id: 3,
    author: "产品经理",
    avatar: "https://picsum.photos/100/100?random=12",
    content: "希望能尽快开放API接口，我们团队已经在做对接准备了。",
    time: "1小时前",
    likes: 8,
    isLiked: false,
  },
]);

const sortedComments = computed(() => {
  if (currentSort.value === "new") {
    return [...commentList.value].reverse();
  }
  return commentList.value;
});

const submitComment = () => {
  if (!newComment.value.trim()) return;

  commentList.value.unshift({
    id: Date.now(),
    author: "我",
    avatar: "https://picsum.photos/100/100?random=99",
    content: newComment.value,
    time: "刚刚",
    likes: 0,
    isLiked: false,
  });

  newComment.value = "";
  showToast("评论成功");
};

const toggleCommentLike = (comment) => {
  comment.isLiked = !comment.isLiked;
  comment.likes += comment.isLiked ? 1 : -1;
};

const replyTo = (comment) => {
  newComment.value = `@${comment.author} `;
  focusComment();
};

const focusComment = () => {
  document
    .getElementById("commentInput")
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
};

const hasMoreComments = ref(true);
const loadingMore = ref(false);

const loadMoreComments = () => {
  loadingMore.value = true;
  setTimeout(() => {
    // 模拟加载更多
    loadingMore.value = false;
    hasMoreComments.value = false;
  }, 1000);
};

// 格式化日期 - 包含分钟级、小时级、天级和月级
const formatDate = (dateStr) => {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;

  // 分钟级
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;

  // 小时级
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return `${hours}小时前`;

  // 天级
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 1) return "昨天";
  if (days === 2) return "前天";
  if (days < 7) return `${days}天前`;

  // 周级
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1周前";
  if (weeks < 4) return `${weeks}周前`;

  // 月级
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}个月前`;

  // 超过一年显示完整日期
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 导航
const goBack = () => {
  router.back();
};

onMounted(() => {
  if (imageList.value.length > 1) {
    startAutoplay();
  }
  // 实际项目中这里应该根据id获取详情
  // const { id } = route.params
});

onUnmounted(() => {
  clearInterval(autoplayTimer);
});
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  padding-bottom: 30px;
}

/* ==================== 顶部导航 ==================== */
.detail-header {
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

.back-btn:active {
  transform: scale(0.95);
}

.back-icon {
  width: 20px;
  height: 20px;
  color: #667eea;
}

.header-right {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.header-right:hover {
  background: rgba(102, 126, 234, 0.1);
}

.share-icon {
  width: 20px;
  height: 20px;
  color: #5f6368;
  transition: all 0.3s ease;
}

.header-right:hover .share-icon {
  color: #667eea;
  transform: scale(1.1);
}

.header-title {
  font-size: 17px;
  font-weight: 600;
  color: #202124;
}

/* ==================== 内容区 ==================== */
.detail-content {
  max-width: 750px;
  margin: 0 auto;
  padding: 16px;
}

.content-wrapper {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

/* ==================== 标题区 ==================== */
.title-section {
  padding: 20px 20px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

/* 用户信息区域 */
.user-info-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  margin-top: 12px;
  border-radius: 12px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(102, 126, 234, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.author-avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(102, 126, 234, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-placeholder:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.author-name {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: #202124;
}

.follow-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 18px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.follow-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.follow-btn:active {
  transform: translateY(0) scale(0.98);
}

.follow-btn.following {
  background: rgba(255, 255, 255, 1);
  color: #9aa0a6;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: none;
}

.follow-btn.following:hover {
  color: #ff6b6b;
  border-color: rgba(255, 107, 107, 0.3);
}

.category-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.detail-title {
  font-size: 22px;
  font-weight: 700;
  color: #202124;
  line-height: 1.4;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #9aa0a6;
}

.dot-separator {
  font-weight: 700;
  opacity: 0.5;
}

/* ==================== 图片展示区 ==================== */
.gallery-section {
  position: relative;
  background: #f8f9fa;
}

.single-image-wrapper {
  width: 100%;
  overflow: hidden;
}

.detail-image {
  width: 100%;
  height: auto;
  display: block;
  cursor: zoom-in;
  transition: transform 0.3s ease;
}

.detail-image:hover {
  transform: scale(1.02);
}

/* 轮播图样式 */
.image-carousel {
  position: relative;
  overflow: hidden;
  background: #000;
}

.carousel-container {
  display: flex;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-item {
  min-width: 100%;
  flex-shrink: 0;
}

.carousel-image {
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
  cursor: pointer;
}

.carousel-indicators {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator-dot.active {
  width: 20px;
  border-radius: 4px;
  background: white;
}

.image-counter {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

/* ==================== 文章内容 ==================== */
.article-content {
  padding: 20px;
  font-size: 16px;
  line-height: 1.8;
  color: #3c4043;
}

.article-content :deep(p) {
  margin-bottom: 16px;
}

.article-content :deep(br) {
  display: block;
  content: "";
  margin-bottom: 12px;
}

/* 发布时间样式 */
.article-publish-time {
  padding: 0 20px 16px;
  text-align: left;
  font-size: 12px;
  color: #9aa0a6;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: 12px;
}

/* ==================== 操作栏 ==================== */
.action-bar {
  display: flex;
  justify-content: space-around;
  padding: 16px 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: linear-gradient(to bottom, #fafbfc, #fff);
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.action-item.active {
  color: #ff6b6b;
}

.action-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-item:hover .action-icon-wrapper {
  background: rgba(102, 126, 234, 0.1);
  transform: scale(1.1);
}

.action-item.active .action-icon-wrapper {
  background: rgba(255, 107, 107, 0.15);
}

.action-icon {
  width: 22px;
  height: 22px;
}

.action-count {
  font-size: 13px;
  font-weight: 600;
  color: #5f6368;
}

.action-item.active .action-count {
  color: #ff6b6b;
}

.action-label {
  font-size: 12px;
  color: #9aa0a6;
  font-weight: 500;
}

.action-item.active .action-label {
  color: #ff6b6b;
}

/* 动画效果 */
.like-anim,
.collect-anim {
  animation: heartBeat 0.3s ease-in-out;
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* ==================== 评论区 ==================== */
.comments-section {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 17px;
  font-weight: 700;
  color: #202124;
  margin: 0;
}

.comment-count {
  font-size: 14px;
  color: #9aa0a6;
  font-weight: 400;
  margin-left: 4px;
}

.sort-tabs {
  display: flex;
  gap: 16px;
}

.sort-tab {
  font-size: 14px;
  color: #9aa0a6;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  font-weight: 500;
}

.sort-tab.active {
  color: #667eea;
  font-weight: 600;
}

.sort-tab.active::after {
  content: "";
  position: absolute;
  bottom: -17px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 2px;
}

/* 评论输入 */
.comment-input-area {
  margin-bottom: 20px;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  background: #f5f6f8;
  padding: 4px;
  border-radius: 24px;
  border: 1px solid transparent;
  transition: all 0.3s;
}

.input-wrapper:focus-within {
  background: #fff;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.comment-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px 16px;
  font-size: 14px;
  color: #202124;
  outline: none;
}

.comment-input::placeholder {
  color: #9aa0a6;
}

.submit-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 20px;
  background: #dadce0;
  color: #9aa0a6;
  font-size: 14px;
  font-weight: 600;
  cursor: not-allowed;
  transition: all 0.3s;
}

.submit-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  cursor: pointer;
}

.submit-btn.active:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* 评论列表 */
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 12px;
  animation: fadeInUp 0.4s ease backwards;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid rgba(102, 126, 234, 0.1);
}

.comment-body {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.comment-author {
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
}

.comment-time {
  font-size: 12px;
  color: #9aa0a6;
}

.comment-text {
  font-size: 14px;
  color: #3c4043;
  line-height: 1.6;
  margin-bottom: 8px;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.comment-action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #9aa0a6;
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;
}

.comment-action:hover {
  color: #667eea;
}

.comment-action.active {
  color: #ff6b6b;
}

.action-icon-small {
  width: 16px;
  height: 16px;
}

/* 加载更多 */
.load-more {
  text-align: center;
  padding: 20px;
  color: #667eea;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.load-more:hover {
  opacity: 0.8;
}

/* ==================== 分享弹窗 ==================== */
.share-popup {
  background: transparent !important;
}

.share-sheet {
  background: white;
  border-radius: 20px 20px 0 0;
  padding: 20px;
}

.share-title {
  text-align: center;
  font-size: 15px;
  color: #5f6368;
  margin-bottom: 20px;
  font-weight: 500;
}

.share-options {
  display: flex;
  justify-content: space-around;
  margin-bottom: 24px;
}

.share-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.3s;
}

.share-option:hover {
  transform: translateY(-2px);
}

.share-icon-bg {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.share-icon-text {
  font-size: 28px;
}

.share-label {
  font-size: 13px;
  color: #5f6368;
  font-weight: 500;
}

.share-cancel {
  text-align: center;
  padding: 16px;
  font-size: 16px;
  color: #5f6368;
  border-top: 1px solid #f0f2f5;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.share-cancel:hover {
  color: #667eea;
  background: #f8f9fa;
}

/* ==================== 动画 ==================== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ==================== 响应式 ==================== */
@media (max-width: 600px) {
  .detail-content {
    padding: 12px;
  }

  .detail-title {
    font-size: 20px;
  }

  .carousel-image {
    height: 220px;
  }

  .action-icon-wrapper {
    width: 40px;
    height: 40px;
  }

  .comment-avatar {
    width: 36px;
    height: 36px;
  }
}
</style>
