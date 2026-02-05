<template>
  <div class="info-home">
    <!-- 顶部导航区 -->
    <div class="nav-header">
      <!-- 搜索栏 -->
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索资讯内容..."
          class="search-input"
        />
        <span v-if="searchQuery" class="clear-icon" @click="searchQuery = ''">✕</span>
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
                  <div class="card-content">
                    <!-- 分类标签胶囊 -->
                    <div class="card-category" :style="{ background: getCategoryColor(item.category) }">
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
                          <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          {{ item.views }}
                        </span>
                        <span class="stat-item">
                          <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
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
                  <div class="card-content">
                    <div class="focus-badge">🔥 焦点资讯</div>
                    <div class="card-category" :style="{ background: getCategoryColor(item.category) }">
                      {{ getCategoryName(item.category) }}
                    </div>
                    <h3 class="card-title focus-title">{{ item.title }}</h3>
                    <p class="card-summary">{{ item.summary }}</p>
                    <div class="card-footer">
                      <div class="card-time">{{ item.publishTime }}</div>
                      <div class="card-stats">
                        <span class="stat-item">
                          <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          {{ item.views }}
                        </span>
                        <span class="stat-item">
                          <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
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
                <div class="card-content">
                  <div class="card-category" :style="{ background: getCategoryColor(item.category) }">
                    {{ getCategoryName(item.category) }}
                  </div>
                  <h3 class="card-title">{{ item.title }}</h3>
                  <p class="card-summary">{{ item.summary }}</p>
                  <div class="card-footer">
                    <div class="card-time">{{ item.publishTime }}</div>
                    <div class="card-stats">
                      <span class="stat-item">
                        <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        {{ item.views }}
                      </span>
                      <span class="stat-item">
                        <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
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
    <div class="bottom-tab-bar">
      <div
        class="tab-item"
        :class="{ active: activeTab === 'home' }"
        @click="activeTab = 'home'"
      >
        <span class="tab-icon">🏠</span>
        <span class="tab-label">首页</span>
      </div>
      <div
        class="tab-item"
        :class="{ active: activeTab === 'profile' }"
        @click="activeTab = 'profile'"
      >
        <span class="tab-icon">👤</span>
        <span class="tab-label">我的</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 分类数据
const categories = ref([
  { id: 'all', name: '全部', icon: '📱' },
  { id: 'tech', name: '科技', icon: '💻' },
  { id: 'finance', name: '财经', icon: '💰' },
  { id: 'entertainment', name: '娱乐', icon: '🎬' },
  { id: 'sports', name: '体育', icon: '⚽' },
  { id: 'life', name: '生活', icon: '🌟' }
]);

// 当前激活分类
const activeCategory = ref('all');

// 当前激活的Tab
const activeTab = ref('home');

// 搜索关键词
const searchQuery = ref('');

// 模拟信息数据
const infoItems = ref([
  {
    id: 1,
    category: 'tech',
    title: 'AI技术突破：新一代大语言模型发布',
    summary: '最新的AI模型在多项基准测试中刷新记录，展现出更强的理解和生成能力...',
    content: '经过数月的研发，新一代大语言模型正式发布。该模型在自然语言理解、代码生成、多模态处理等方面都有显著提升。',
    views: '12.5k',
    comments: '328',
    likes: '1.2k',
    publishTime: '2小时前',
    cover: ''
  },
  {
    id: 2,
    category: 'finance',
    title: '全球股市震荡，投资者关注央行政策',
    summary: '受多重因素影响,主要股指出现波动,市场静待政策信号...',
    content: '本周全球主要股市呈现震荡态势。分析师认为,投资者正在密切关注各国央行的货币政策走向。',
    views: '8.2k',
    comments: '156',
    likes: '892',
    publishTime: '4小时前',
    cover: ''
  },
  {
    id: 3,
    category: 'entertainment',
    title: '新片票房破纪录，观众好评如潮',
    summary: '最新上映的科幻大片首周末票房突破5亿,成为年度现象级作品...',
    content: '这部备受期待的科幻大片不负众望,上映三天票房就突破5亿大关。',
    views: '15.8k',
    comments: '892',
    likes: '2.3k',
    publishTime: '5小时前',
    cover: ''
  },
  {
    id: 4,
    category: 'sports',
    title: '篮球联赛季后赛激战正酣',
    summary: '多场比赛进入白热化阶段,球星表现引发热议...',
    content: '本赛季季后赛竞争格外激烈,多支球队实力接近。',
    views: '6.3k',
    comments: '445',
    likes: '567',
    publishTime: '7小时前',
    cover: ''
  },
  {
    id: 5,
    category: 'tech',
    title: '5G应用场景持续扩展，智慧城市建设提速',
    summary: '5G技术在交通、医疗、教育等领域的应用日益成熟...',
    content: '随着5G网络覆盖的不断完善,其在各行各业的应用场景持续扩展。',
    views: '9.7k',
    comments: '267',
    likes: '1.5k',
    publishTime: '8小时前',
    cover: '',
    isFocus: true // 焦点卡片
  },
  {
    id: 6,
    category: 'life',
    title: '健康饮食新趋势：植物基食品受追捧',
    summary: '越来越多的消费者选择植物基饮食,市场规模快速增长...',
    content: '近年来,植物基食品在全球范围内掀起热潮。',
    views: '5.1k',
    comments: '189',
    likes: '723',
    publishTime: '10小时前',
    cover: ''
  },
  {
    id: 7,
    category: 'tech',
    title: '量子计算取得新突破，商业化应用加速',
    summary: '研究团队成功实现量子纠错,为大规模量子计算铺平道路...',
    content: '最新研究在量子纠错技术上取得重大突破,显著提高了量子比特的稳定性。',
    views: '11.2k',
    comments: '298',
    likes: '1.8k',
    publishTime: '3小时前',
    cover: ''
  },
  {
    id: 8,
    category: 'entertainment',
    title: '音乐节热潮来袭，多场大型演出即将开演',
    summary: '春季音乐节季拉开帷幕,国内外知名艺人齐聚...',
    content: '随着天气转暖,各大音乐节陆续公布阵容。',
    views: '13.6k',
    comments: '521',
    likes: '2.1k',
    publishTime: '6小时前',
    cover: ''
  }
]);

// 过滤后的信息列表（分类 + 搜索）
const filteredItems = computed(() => {
  let items = infoItems.value;
  
  // 按分类过滤
  if (activeCategory.value !== 'all') {
    items = items.filter(item => item.category === activeCategory.value);
  }
  
  // 按搜索关键词过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    items = items.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.summary.toLowerCase().includes(query)
    );
  }
  
  return items;
});

// 双列瀑布流分配（焦点卡片占据左列通栏位置）
const leftColumnItems = computed(() => {
  return filteredItems.value.filter((_, index) => index % 2 === 0);
});

const rightColumnItems = computed(() => {
  // 右列过滤掉焦点卡片
  return filteredItems.value.filter((item, index) => index % 2 === 1 && !item.isFocus);
});

// 分类筛选
const filterByCategory = (categoryId) => {
  activeCategory.value = categoryId;
};

// 打开详情
const openDetail = (item) => {
  console.log('打开详情:', item);
  // 这里可以添加跳转逻辑或弹窗逻辑
};

// 获取分类名称
const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId);
  return category ? category.name : '';
};

// 获取分类颜色
const getCategoryColor = (categoryId) => {
  const colorMap = {
    tech: 'linear-gradient(135deg, #667eea, #764ba2)',
    finance: 'linear-gradient(135deg, #f093fb, #f5576c)',
    entertainment: 'linear-gradient(135deg, #fa709a, #fee140)',
    sports: 'linear-gradient(135deg, #30cfd0, #330867)',
    life: 'linear-gradient(135deg, #a8edea, #fed6e3)'
  };
  return colorMap[categoryId] || 'linear-gradient(135deg, #667eea, #764ba2)';
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.info-home {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
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
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.search-wrapper:focus-within {
  background: #fff;
  border-color: #667eea;
  box-shadow: 
    inset 0 1px 3px rgba(0, 0, 0, 0.08),
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
  background: linear-gradient(to bottom, 
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
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.06),
    0 2px 6px rgba(0, 0, 0, 0.09);
  position: relative;
}

/* 悬停反馈 - 上移 + 阴影增强 + 标签亮度 */
.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.08),
    0 3px 8px rgba(0, 0, 0, 0.12);
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
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.08),
    0 3px 8px rgba(0, 0, 0, 0.12);
}

.focus-card:hover {
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.1),
    0 4px 10px rgba(0, 0, 0, 0.14);
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

/* ==================== 底部Tab栏 ==================== */
.bottom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 102;
  display: flex;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.08);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
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
  color: #9aa0a6;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tab-item.active .tab-label {
  color: #667eea;
  font-weight: 600;
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
</style>