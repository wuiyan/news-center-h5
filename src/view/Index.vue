<template>
  <div class="info-home">
    <!-- 顶部导航区 -->
    <div class="nav-header">
      <!-- 搜索栏 -->
      <div class="search-wrapper">
        <span class="search-icon" @click="handleSearch">🔍</span>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索资讯内容..."
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <span v-if="searchQuery" class="clear-icon" @click="clearSearch"
          >✕</span
        >
      </div>

      <!-- 胶囊式分类标签栏 -->
      <div class="category-bar">
        <div class="category-scroll">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-tag"
            :class="{ active: activeCategory === category.id }"
            @click="filterByCategory(category.id)"
          >
            <span class="category-icon">{{ category.icon }}</span>
            <span>{{ category.name }}</span>
          </div>
        </div>
      </div>

      <!-- 视觉隔断 -->
      <div class="nav-divider"></div>
    </div>

    <!-- 内容流区域 -->
    <div class="content-flow">
      <!-- Vant 全屏加载 -->
      <van-overlay :show="isLoading" class-name="loading-overlay">
        <div class="loading-wrapper">
          <van-loading type="spinner" color="#1989fa" size="40px" />
          <span class="loading-text">加载中...</span>
        </div>
      </van-overlay>
      <div class="content-container">
        <div class="waterfall-wrapper">
          <!-- 左列 -->
          <div class="waterfall-column">
            <template v-for="(item, index) in leftColumnItems" :key="item.id">
              <!-- 普通卡片 -->
              <div
                v-if="!item.isFocus"
                class="card-wrapper"
                @click="openDetail(item)"
              >
                <div class="info-card">
                  <!-- 封面图片 -->
                  <div v-if="getCoverImage(item)" class="card-cover">
                    <img
                      :src="getCoverImage(item)"
                      :alt="item.title"
                      class="cover-image"
                      @error="handleImageError"
                    />
                  </div>

                  <div class="card-content">
                    <!-- 分类标签胶囊 -->
                    <div
                      class="card-category"
                      :style="{ background: getCategoryColor(item.category) }"
                    >
                      {{ getCategoryName(item.category) }}
                    </div>

                    <!-- 标题 -->
                    <h3 class="card-title">{{ item.title }}</h3>

                    <!-- 摘要 -->
                    <p class="card-summary">{{ item.summary }}</p>

                    <!-- 底部信息栏 -->
                    <div class="card-footer">
                      <div class="card-time">{{ item.publishTime }}</div>
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
                            ></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          {{ item.views }}
                        </span>
                        <span class="stat-item">
                          <svg
                            class="stat-icon"
                            viewBox="0 0 24 24"
                            :fill="item.isLiked ? 'currentColor' : 'none'"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            ></path>
                          </svg>
                          {{ item.likes }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 焦点卡片（通栏） -->
              <div
                v-else
                class="card-wrapper focus-card-wrapper"
                @click="openDetail(item)"
              >
                <div class="info-card focus-card">
                  <!-- 焦点卡片封面图 -->
                  <div
                    v-if="getCoverImage(item)"
                    class="card-cover focus-cover"
                  >
                    <img
                      :src="getCoverImage(item)"
                      :alt="item.title"
                      class="cover-image"
                      @error="handleImageError"
                    />
                  </div>

                  <div class="card-content">
                    <div class="focus-badge">🔥 焦点资讯</div>
                    <div
                      class="card-category"
                      :style="{ background: getCategoryColor(item.category) }"
                    >
                      {{ getCategoryName(item.category) }}
                    </div>
                    <h3 class="card-title focus-title">{{ item.title }}</h3>
                    <p class="card-summary">{{ item.summary }}</p>
                    <div class="card-footer">
                      <div class="card-time">{{ item.publishTime }}</div>
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
                            ></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          {{ item.views }}
                        </span>
                        <span class="stat-item">
                          <svg
                            class="stat-icon"
                            viewBox="0 0 24 24"
                            :fill="item.isLiked ? 'currentColor' : 'none'"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            ></path>
                          </svg>
                          {{ item.likes }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- 右列 -->
          <div class="waterfall-column">
            <div
              v-for="item in rightColumnItems"
              :key="item.id"
              class="card-wrapper"
              @click="openDetail(item)"
            >
              <div class="info-card">
                <!-- 封面图片 -->
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
                    <div class="card-time">{{ item.publishTime }}</div>
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
                          ></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        {{ item.views }}
                      </span>
                      <span class="stat-item">
                        <svg
                          class="stat-icon"
                          viewBox="0 0 24 24"
                          :fill="item.isLiked ? 'currentColor' : 'none'"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                          ></path>
                        </svg>
                        {{ item.likes }}
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

    <!-- 底部Tab栏 -->
    <BottomTabBar />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { getNewsList, getNewsCategories, searchNews } from "../api/news.js";
import { onMounted } from "vue";
import BottomTabBar from "../components/BottomTabBar.vue";

// 引入环境变量中的API基础地址
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const router = useRouter();

// 分类数据
const categories = ref([
  { id: "all", name: "全部", icon: "📱" },
  { id: "tech", name: "科技", icon: "💻" },
  { id: "finance", name: "财经", icon: "💰" },
  { id: "entertainment", name: "娱乐", icon: "🎬" },
  { id: "sports", name: "体育", icon: "⚽" },
  { id: "life", name: "生活", icon: "🌟" },
]);

// 当前激活分类
const activeCategory = ref("all");

// 当前激活的Tab
const activeTab = ref("home");

// 加载状态
const isLoading = ref(false);

// 搜索关键词
const searchQuery = ref("");

// 获取信息列表
const infoItems = ref([]);

// 挂载时获取信息列表
onMounted(() => {
  loadNewsCategories();
  loadNewsList();
});

// 获取信息分类
const loadNewsCategories = async () => {
  try {
    const categoryData = await getNewsCategories();
    categories.value = categoryData.data || [];
  } catch (error) {
    console.error("获取分类失败:", error);
  }
};

// 获取信息列表
const loadNewsList = async () => {
  try {
    isLoading.value = true;
    const newList = await getNewsList();
    infoItems.value = newList.data.list || [];
  } catch (error) {
    console.error("获取信息列表失败:", error);
  } finally {
    isLoading.value = false;
  }
};

// 执行搜索（回车触发）
const handleSearch = async () => {
  const keyword = searchQuery.value.trim();
  isLoading.value = true;

  try {
    const response = await searchNews(keyword);
    infoItems.value = response.data.list || [];
  } catch (err) {
    console.error("搜索失败:", err);
  } finally {
    isLoading.value = false;
  }
};

// 清空搜索
const clearSearch = () => {
  searchQuery.value = "";
  loadNewsList();
};

// 过滤后的信息列表（分类）
const filteredItems = computed(() => {
  let items = infoItems.value;

  // 按分类过滤
  if (activeCategory.value !== "all") {
    items = items.filter((item) => item.category === activeCategory.value);
  }

  return items;
});

// 双列瀑布流分配（焦点卡片占据左列通栏位置）
const leftColumnItems = computed(() => {
  return filteredItems.value.filter((_, index) => index % 2 === 0);
});

const rightColumnItems = computed(() => {
  return filteredItems.value.filter(
    (item, index) => index % 2 === 1 && !item.isFocus
  );
});

// 分类筛选
const filterByCategory = (categoryId) => {
  activeCategory.value = categoryId;
};

// 打开详情
const openDetail = (item) => {
  console.log("打开详情:", item);
  router.push({
    path: "/detail",
    query: { id: item.id },
  });
};

// 获取分类名称
const getCategoryName = (categoryId) => {
  const category = categories.value.find((c) => c.id === categoryId);
  return category ? category.name : "";
};

// 获取分类颜色
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

// 获取封面图片 - 从cover字符串中提取第一张图片
const getCoverImage = (item) => {
  if (!item.cover) return null;

  let coverUrl = "";

  // 处理cover是字符串的情况（逗号分隔）
  if (typeof item.cover === "string") {
    // 去除首尾空格，按逗号分割，过滤空值
    const coverArray = item.cover
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (coverArray.length === 0) return null;
    coverUrl = coverArray[0];
  } else {
    return null;
  }

  // 如果没有URL，返回null
  if (!coverUrl) return null;

  // 如果已经是完整URL，直接返回
  if (coverUrl.startsWith("http://") || coverUrl.startsWith("https://")) {
    return coverUrl;
  }

  // 拼接基础URL
  const baseUrl = IMAGE_BASE_URL.endsWith("/")
    ? IMAGE_BASE_URL.slice(0, -1)
    : IMAGE_BASE_URL;
  const path = coverUrl.startsWith("/") ? coverUrl : `/${coverUrl}`;

  return `${baseUrl}${path}`;
};

// 图片加载失败处理
const handleImageError = (e) => {
  // 可以设置一个默认图片
  e.target.src =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18"%3E暂无图片%3C/text%3E%3C/svg%3E';
  e.target.style.objectFit = "contain";
};

const goToProfile = () => {
  router.push("/profile");
};
</script>

<style scoped>
/* 封面图片样式 */
.card-cover {
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
  background: #f5f5f5;
}

.focus-cover {
  height: 220px;
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

/* 调整卡片内容的边距 */
.card-cover + .card-content {
  padding-top: 12px;
}
</style>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.info-home {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  padding-bottom: 70px;
}

/* ==================== 顶部导航区 ==================== */
.nav-header {
  position: sticky;
  top: 0;
  z-index: 101;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  padding: 12px 16px 0;
}

/* 搜索栏优化 - 圆角 + 内阴影 */
.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #f5f6f8;
  border-radius: 15px;
  padding: 10px 14px;
  margin-bottom: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.search-wrapper:focus-within {
  background: #fff;
  border-color: #667eea;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08),
    0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-icon {
  font-size: 16px;
  margin-right: 8px;
  opacity: 0.5;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #333;
  outline: none;
}

.search-input::placeholder {
  color: #aaa;
}

.clear-icon {
  font-size: 14px;
  color: #999;
  cursor: pointer;
  padding: 4px;
  transition: all 0.2s;
  border-radius: 50%;
}

.clear-icon:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

/* 胶囊式分类标签栏 */
.category-bar {
  padding-bottom: 12px;
}

.category-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.category-scroll::-webkit-scrollbar {
  display: none;
}

/* 胶囊式标签 */
.category-tag {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 7px 14px;
  background: #e8eaed;
  border-radius: 18px;
  color: #5f6368;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  user-select: none;
}

.category-tag:hover:not(.active) {
  background: #dadce0;
  transform: translateY(-1px);
}

/* 选中态胶囊 - 主题色填充 + 阴影 */
.category-tag.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

.category-icon {
  font-size: 14px;
}

/* 视觉隔断 - 渐变分割线 */
.nav-divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(102, 126, 234, 0) 0%,
    rgba(102, 126, 234, 0.15) 50%,
    rgba(102, 126, 234, 0) 100%
  );
  margin: 0 -16px;
}

/* ==================== 内容流区域 ==================== */
.content-flow {
  /* 浅紫色半透明背景 - 与主色调呼应 */
  background: rgba(102, 126, 234, 0.08);
  min-height: calc(100vh - 180px);
  padding-top: 16px;
}

.content-container {
  max-width: 750px;
  margin: 0 auto;
  /* 侧边留白优化 - 左右各20px */
  padding: 0 20px 20px;
}

/* 瀑布流容器 */
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

/* ==================== 普通卡片样式 ==================== */
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

/* 悬浮式卡片 - 大圆角 + 双层阴影 */
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
  /* 双层阴影 - 底层模糊 + 上层锐化 */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.09);
  position: relative;
}

/* 悬停反馈 - 上移 + 阴影增强 + 标签亮度 */
.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08), 0 3px 8px rgba(0, 0, 0, 0.12);
}

.info-card:hover .card-category {
  filter: brightness(1.1);
}

/* 点击动效 - 按压缩小 */
.info-card:active {
  transform: translateY(-2px) scale(0.98);
  transition: transform 0.1s;
}

.card-content {
  padding: 14px;
}

/* 分类标签胶囊 - 左上角 */
.card-category {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  transition: filter 0.3s;
}

/* 标题 - 16px 加粗深灰 */
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

/* 摘要 - 14px 浅灰 */
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

/* 卡片底部信息栏 */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.card-time {
  font-size: 12px;
  color: #9aa0a6;
  font-weight: 400;
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

/* 简约线性图标 */
.stat-icon {
  width: 14px;
  height: 14px;
  opacity: 0.7;
}

/* ==================== 焦点卡片样式 ==================== */
.focus-card-wrapper {
  /* 焦点卡片占据通栏 */
  grid-column: 1 / -1;
}

.focus-card {
  /* 更厚重的阴影 */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08), 0 3px 8px rgba(0, 0, 0, 0.12);
}

.focus-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.14);
}

.focus-badge {
  display: inline-block;
  padding: 4px 10px;
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 10px;
  margin-bottom: 8px;
  margin-right: 6px;
  box-shadow: 0 2px 6px rgba(255, 107, 107, 0.3);
}

/* 焦点卡片标题 - 18px 加粗 */
.focus-title {
  font-size: 18px;
  font-weight: 800;
}

/* ==================== 响应式设计 ==================== */
@media (min-width: 601px) and (max-width: 768px) {
  /* 平板端 - 增加卡片间距 */
  .waterfall-wrapper {
    gap: 16px;
  }

  .waterfall-column {
    gap: 16px;
  }
}

@media (max-width: 600px) {
  .nav-header {
    padding: 10px 12px 0;
  }

  .search-wrapper {
    padding: 9px 12px;
    margin-bottom: 10px;
  }

  .category-bar {
    padding-bottom: 10px;
  }

  .category-tag {
    padding: 6px 12px;
    font-size: 12px;
  }

  .content-container {
    padding: 0 12px 16px;
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

  .focus-title {
    font-size: 17px;
  }
}

/* ==================== 骨架屏加载效果 ==================== */
@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

.skeleton-card {
  background: linear-gradient(
    to right,
    rgba(240, 242, 245, 0.95) 0%,
    rgba(250, 250, 250, 0.95) 20%,
    rgba(240, 242, 245, 0.95) 40%,
    rgba(240, 242, 245, 0.95) 100%
  );
  background-size: 800px 104px;
  animation: shimmer 1.2s infinite;
  border-radius: 14px;
  height: 200px;
}

/* ==================== 无数据提示 ==================== */
.no-data {
  text-align: center;
  padding: 80px 20px;
  color: rgba(255, 255, 255, 0.9);
}

.no-data-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.7;
}

.no-data-text {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
}

/* ==================== 遮罩层 ==================== */

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

/* 在 style 标签中添加 */
body {
  /* 防止iOS橡皮筋滚动影响fixed元素 */
  -webkit-overflow-scrolling: touch;
}

/* 确保页面内容区域有正确的padding，避免内容被底部栏遮挡 */
.info-home,
.profile-page {
  /* 关键：使用padding-bottom而不是margin，避免高度计算问题 */
  padding-bottom: calc(64px + env(safe-area-inset-bottom) + 20px);
  /* 创建BFC防止margin collapse */
  overflow-x: hidden;
}
</style>
