<template>
  <div class="publish-page">
    <!-- 顶部导航栏 -->
    <div class="nav-header">
      <div class="nav-bar">
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
        <h1 class="nav-title">发布资讯</h1>
        <div class="nav-placeholder"></div>
      </div>
      <div class="nav-divider"></div>
    </div>

    <!-- 主内容区 -->
    <div class="publish-content">
      <!-- 标题输入区 -->
      <div class="section-block">
        <div class="section-title">
          <span class="title-icon">✏️</span>
          <span>资讯标题</span>
        </div>
        <div class="input-wrapper">
          <input
            v-model="formData.title"
            type="text"
            placeholder="请输入吸引人的标题..."
            class="title-input"
            maxlength="50"
          />
          <span class="input-count">{{ formData.title.length }}/50</span>
        </div>
      </div>
      
      <!-- 图片上传区 -->
      <div class="section-block image-section">
        <div class="section-title">
          <span class="title-icon">📷</span>
          <span>添加图片</span>
          <span class="image-count">{{ imageList.length }}/6</span>
        </div>

        <div class="image-grid">
          <!-- 已上传图片 - 使用本地预览URL -->
          <div
            v-for="(img, index) in imageList"
            :key="index"
            class="image-item"
            :style="{ backgroundImage: `url(${img.previewUrl})` }"
          >
            <div class="image-overlay">
              <span class="delete-btn" @click.stop="removeImage(index)">✕</span>
              <!-- 显示上传状态 -->
              <div v-if="img.uploading" class="upload-status">
                <van-loading type="spinner" color="#fff" size="20px" />
              </div>
              <div v-else-if="img.uploadError" class="upload-status error">
                <span>❌</span>
              </div>
              <div v-else-if="img.serverUrl" class="upload-status success">
                <span>✓</span>
              </div>
            </div>
          </div>

          <!-- 上传按钮 -->
          <div
            v-if="imageList.length < 6"
            class="upload-btn"
            @click="triggerUpload"
            :class="{ uploading: isUploading }"
          >
            <div class="upload-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <span class="upload-text">{{
              isUploading ? "上传中..." : "点击上传"
            }}</span>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              multiple
              style="display: none"
              @change="handleFileChange"
            />
          </div>
        </div>
      </div>

      <!-- 正文编辑区 -->
      <div class="section-block">
        <div class="section-title">
          <span class="title-icon">📝</span>
          <span>正文内容</span>
        </div>
        <div class="textarea-wrapper">
          <textarea
            v-model="formData.content"
            placeholder="分享你的资讯内容..."
            class="content-textarea"
            rows="6"
          ></textarea>
          <div class="textarea-toolbar">
            <span class="word-count">{{ contentLength }} 字</span>
          </div>
        </div>
      </div>

      <!-- 选项区 -->
      <div class="section-block options-section">
        <!-- 分类选择 -->
        <div class="option-row">
          <div class="option-label">
            <span class="label-icon">🏷️</span>
            <span>选择分类</span>
          </div>
          <div class="category-selector" @click="showCategoryPicker = true">
            <span
              v-if="selectedCategory"
              class="selected-category"
              :style="{ background: getCategoryColor(selectedCategory.id) }"
            >
              {{ selectedCategory.icon }} {{ selectedCategory.name }}
            </span>
            <span v-else class="placeholder">请选择分类</span>
            <svg
              class="arrow-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>

        <!-- 摘要输入 -->
        <div class="option-row summary-row">
          <div class="option-label">
            <span class="label-icon">📋</span>
            <span>内容摘要</span>
            <span class="limit-hint">限30字</span>
          </div>
          <div class="summary-input-wrapper">
            <input
              v-model="formData.summary"
              type="text"
              placeholder="一句话概括内容要点..."
              class="summary-input"
              maxlength="30"
            />
            <span
              class="input-count"
              :class="{ warning: formData.summary.length >= 30 }"
            >
              {{ formData.summary.length }}/30
            </span>
          </div>
        </div>
      </div>

      <!-- 发布按钮 -->
      <div class="publish-btn-wrapper">
        <button
          class="publish-btn"
          :class="{ disabled: !canPublish, loading: isPublishing }"
          @click="handlePublish"
          :disabled="!canPublish || isPublishing"
        >
          <span v-if="isPublishing" class="btn-loading">
            <svg
              class="spinner"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke-dasharray="60"
                stroke-dashoffset="20"
              />
            </svg>
          </span>
          <span v-else>🚀 立即发布</span>
        </button>
        <p class="publish-tip">发布即表示同意社区内容规范</p>
      </div>
    </div>

    <!-- 分类选择弹窗 -->
    <van-popup
      v-model:show="showCategoryPicker"
      position="bottom"
      round
      class="category-popup"
    >
      <div class="popup-header">
        <span class="popup-title">选择分类</span>
        <span class="popup-close" @click="showCategoryPicker = false">✕</span>
      </div>
      <div class="category-grid">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-option"
          :class="{ active: formData.category === category.id }"
          @click="selectCategory(category)"
        >
          <span class="option-icon">{{ category.icon }}</span>
          <span class="option-name">{{ category.name }}</span>
          <svg
            v-if="formData.category === category.id"
            class="check-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      </div>
    </van-popup>

    <!-- 加载遮罩 -->
    <van-overlay :show="isPublishing" class-name="loading-overlay">
      <div class="loading-wrapper">
        <van-loading type="spinner" color="#667eea" size="40px" />
        <span class="loading-text">发布中...</span>
      </div>
    </van-overlay>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, reactive } from "vue";
import { useRouter } from "vue-router";
import { showToast, showFailToast } from "vant";
import { publishNews } from "../api/news.js";
import { uploadImage } from "../api/tools";

const router = useRouter();

// API基础URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// 分类数据
const categories = [
  { id: "tech", name: "科技", icon: "💻" },
  { id: "finance", name: "财经", icon: "💰" },
  { id: "entertainment", name: "娱乐", icon: "🎬" },
  { id: "sports", name: "体育", icon: "⚽" },
  { id: "life", name: "生活", icon: "🌟" },
];

// 表单数据
const formData = ref({
  title: "",
  content: "",
  summary: "",
  category: "",
  cover: ""
});

// 图片列表 - 使用普通对象，不嵌套ref
const imageList = ref([]);
const fileInput = ref(null);
const isUploading = ref(false);
const isPublishing = ref(false);
const showCategoryPicker = ref(false);

// 计算属性
const selectedCategory = computed(() => {
  return categories.find((c) => c.id === formData.value.category);
});

const contentLength = computed(() => {
  return formData.value.content.length;
});

const canPublish = computed(() => {
  // 检查是否有图片正在上传
  const hasUploadingImages = imageList.value.some(img => img.uploading);
  
  return (
    formData.value.title.trim() &&
    formData.value.content.trim() &&
    formData.value.category &&
    formData.value.summary.trim() &&
    !hasUploadingImages // 确保没有图片正在上传
  );
});

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

// 返回上一页
const goBack = () => {
  router.back();
};

// 触发文件上传
const triggerUpload = () => {
  if (!isUploading.value) {
    fileInput.value.click();
  }
};

// 处理文件选择 - 立即显示本地预览，后台上传
const handleFileChange = async (e) => {
  const files = Array.from(e.target.files);
  const remainingSlots = 6 - imageList.value.length;
  const validFiles = files.slice(0, remainingSlots);
  
  if (files.length > remainingSlots) {
    showToast(`最多只能上传6张图片，已自动筛选前${remainingSlots}张`);
  }

  if (validFiles.length === 0) return;

  // 立即创建本地预览
  validFiles.forEach((file, idx) => {
    // 创建本地预览URL
    const previewUrl = URL.createObjectURL(file);
    
    // 添加到图片列表（立即显示）- 使用reactive对象
    const imageItem = reactive({
      file: file,
      previewUrl: previewUrl,
      serverUrl: null,
      uploading: true,
      uploadError: false
    });
    
    imageList.value.push(imageItem);
    
    // 异步上传到服务器
    uploadToServer(imageItem);
  });
  
  showToast(`已添加 ${validFiles.length} 张图片`);
  
  // 清空input
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// 上传到服务器 - 直接修改reactive对象
const uploadToServer = async (imageItem) => {
  try {
    const response = await uploadImage(imageItem.file);
    
    if (response.code == 200 || response.success) {
      // 提取服务器返回的图片路径
      let serverUrl = response.data;
     
      if (serverUrl) {
        // 直接修改reactive对象的属性
        imageItem.serverUrl = serverUrl;
        imageItem.uploading = false;
        imageItem.uploadError = false;
        console.log('上传成功:', serverUrl);
      } else {
        throw new Error('服务器未返回图片URL');
      }
    } else {
      throw new Error(response.msg || response.message || '上传失败');
    }
  } catch (error) {
    console.error('图片上传失败:', error);
    imageItem.uploading = false;
    imageItem.uploadError = true;
    showFailToast('图片上传失败，请删除后重试');
  }
};

// 删除图片
const removeImage = (index) => {
  const image = imageList.value[index];
  
  // 释放本地预览URL
  if (image.previewUrl && image.previewUrl.startsWith('blob:')) {
    URL.revokeObjectURL(image.previewUrl);
  }
  
  imageList.value.splice(index, 1);
  showToast("已删除");
};

// 选择分类
const selectCategory = (category) => {
  formData.value.category = category.id;
  showCategoryPicker.value = false;
};

// 发布资讯
const handlePublish = async () => {
  if (!canPublish.value) {
    showToast('请填写完整信息或等待图片上传完成');
    return;
  }
  
  // 检查是否有上传失败的图片
  const hasFailedImages = imageList.value.some(img => img.uploadError);
  if (hasFailedImages) {
    showFailToast('存在上传失败的图片，请删除后重试');
    return;
  }
  
  isPublishing.value = true;
  
  try {
    // 提取所有成功上传的图片服务器路径
    const serverImageUrls = imageList.value
      .filter(img => img.serverUrl)
      .map(img => img.serverUrl);
    
    if (serverImageUrls.length === 0 && imageList.value.length > 0) {
      throw new Error('图片未上传完成，请稍后再试');
    }
    
    // 构建发布数据
    const publishData = {
      title: formData.value.title.trim(),
      content: formData.value.content.trim(),
      summary: formData.value.summary.trim(),
      category: formData.value.category,
      cover: serverImageUrls.join(',')
    };

    console.log('发布数据:', publishData);

    // 调用API
    const response = await publishNews(publishData);
    
    if (response.code === 200 || response.success || response.data) {
      showToast('发布成功！');
      
      // 清理本地预览URL
      imageList.value.forEach(img => {
        if (img.previewUrl && img.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
      
      // 清空表单
      formData.value = {
        title: '',
        content: '',
        summary: '',
        category: '',
        cover: ''
      };
      imageList.value = [];
      
      // 延迟跳转
      setTimeout(() => {
        isPublishing.value = false;
        router.push('/index');
      }, 800);
    } else {
      throw new Error(response.msg || response.message || '发布失败');
    }
    
  } catch (error) {
    console.error('发布失败:', error);
    showFailToast(error.message || '发布失败，请重试');
    isPublishing.value = false;
  }
};

// 组件卸载时清理所有本地预览URL
onBeforeUnmount(() => {
  imageList.value.forEach(img => {
    if (img.previewUrl && img.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(img.previewUrl);
    }
  });
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.publish-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  padding-bottom: 40px;
}

/* ==================== 顶部导航 ==================== */
.nav-header {
  position: sticky;
  top: 0;
  z-index: 101;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  height: 56px;
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

.back-icon {
  width: 20px;
  height: 20px;
  color: #667eea;
}

.nav-title {
  font-size: 17px;
  font-weight: 600;
  color: #202124;
  letter-spacing: 0.5px;
}

.nav-placeholder {
  width: 36px;
}

.nav-divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(102, 126, 234, 0) 0%,
    rgba(102, 126, 234, 0.15) 50%,
    rgba(102, 126, 234, 0) 100%
  );
}

/* ==================== 主内容区 ==================== */
.publish-content {
  max-width: 750px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 区块卡片 - 玻璃拟态效果 */
.section-block {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.09);
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

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #202124;
  margin-bottom: 12px;
}

.title-icon {
  font-size: 16px;
}

/* ==================== 图片上传区 ==================== */
.image-section {
  animation-delay: 0.05s;
}

.image-count {
  margin-left: auto;
  font-size: 13px;
  color: #9aa0a6;
  font-weight: 500;
  background: rgba(102, 126, 234, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.image-item {
  aspect-ratio: 1;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.image-item:hover {
  transform: scale(1.02);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 6px;
}

.image-item:hover .image-overlay {
  background: rgba(0, 0, 0, 0.2);
}

.delete-btn {
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #ff4444;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.image-item:hover .delete-btn {
  opacity: 1;
  transform: scale(1);
}

.delete-btn:hover {
  background: #ff4444;
  color: white;
  transform: scale(1.1) rotate(90deg);
}

.upload-btn {
  aspect-ratio: 1;
  border-radius: 12px;
  border: 2px dashed rgba(102, 126, 234, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(102, 126, 234, 0.02);
}

.upload-btn:hover:not(.uploading) {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.08);
  transform: translateY(-2px);
}

.upload-btn.uploading {
  opacity: 0.6;
  cursor: not-allowed;
}

.upload-icon {
  width: 32px;
  height: 32px;
  color: #667eea;
}

.upload-icon svg {
  width: 100%;
  height: 100%;
}

.upload-text {
  font-size: 12px;
  color: #667eea;
  font-weight: 500;
}

/* ==================== 输入区样式 ==================== */
.input-wrapper {
  position: relative;
}

.title-input {
  width: 100%;
  padding: 12px 40px 12px 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: #202124;
  background: #f8f9fa;
  transition: all 0.3s ease;
  outline: none;
}

.title-input:focus {
  border-color: #667eea;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.title-input::placeholder {
  color: #9aa0a6;
}

.input-count {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #9aa0a6;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 6px;
  border-radius: 6px;
}

/* 文本域样式 */
.textarea-wrapper {
  position: relative;
}

.content-textarea {
  width: 100%;
  padding: 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  font-size: 15px;
  line-height: 1.6;
  color: #202124;
  background: #f8f9fa;
  resize: none;
  transition: all 0.3s ease;
  outline: none;
  font-family: inherit;
}

.content-textarea:focus {
  border-color: #667eea;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.content-textarea::placeholder {
  color: #9aa0a6;
}

.textarea-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.word-count {
  font-size: 12px;
  color: #9aa0a6;
  background: rgba(102, 126, 234, 0.1);
  padding: 4px 10px;
  border-radius: 10px;
  font-weight: 500;
}

/* ==================== 选项区样式 ==================== */
.options-section {
  animation-delay: 0.1s;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.option-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #5f6368;
}

.label-icon {
  font-size: 15px;
}

.limit-hint {
  margin-left: auto;
  font-size: 12px;
  color: #9aa0a6;
  font-weight: 500;
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
  padding: 2px 8px;
  border-radius: 10px;
}

/* 分类选择器 */
.category-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.category-selector:hover {
  background: rgba(102, 126, 234, 0.08);
  border-color: rgba(102, 126, 234, 0.2);
}

.selected-category {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.placeholder {
  color: #9aa0a6;
  font-size: 14px;
}

.arrow-icon {
  width: 18px;
  height: 18px;
  color: #9aa0a6;
  transition: transform 0.3s ease;
}

.category-selector:hover .arrow-icon {
  transform: translateX(2px);
  color: #667eea;
}

/* 摘要输入 */
.summary-row {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: 16px;
}

.summary-input-wrapper {
  position: relative;
}

.summary-input {
  width: 100%;
  padding: 12px 50px 12px 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  font-size: 14px;
  color: #202124;
  background: #f8f9fa;
  transition: all 0.3s ease;
  outline: none;
}

.summary-input:focus {
  border-color: #667eea;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.summary-input::placeholder {
  color: #9aa0a6;
}

.summary-input-wrapper .input-count {
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
}

.input-count.warning {
  color: #ff6b6b;
  font-weight: 600;
  animation: pulse 0.3s ease;
}

@keyframes pulse {
  0%,
  100% {
    transform: translateY(-50%) scale(1);
  }
  50% {
    transform: translateY(-50%) scale(1.1);
  }
}

/* ==================== 发布按钮 ==================== */
.publish-btn-wrapper {
  margin-top: 8px;
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.15s backwards;
}

.publish-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 14px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 1px;
}

.publish-btn:hover:not(.disabled):not(.loading) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.publish-btn:active:not(.disabled):not(.loading) {
  transform: translateY(0) scale(0.98);
}

.publish-btn.disabled {
  background: linear-gradient(135deg, #dadce0 0%, #9aa0a6 100%);
  cursor: not-allowed;
  box-shadow: none;
  opacity: 0.7;
}

.publish-btn.loading {
  cursor: wait;
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.publish-tip {
  text-align: center;
  margin-top: 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* ==================== 分类弹窗 ==================== */
.category-popup {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 20px 20px 0 0;
  padding-bottom: env(safe-area-inset-bottom);
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.popup-title {
  font-size: 17px;
  font-weight: 600;
  color: #202124;
}

.popup-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #9aa0a6;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.popup-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #202124;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.category-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border-radius: 16px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border: 2px solid transparent;
}

.category-option:hover {
  background: rgba(102, 126, 234, 0.08);
  transform: translateY(-2px);
}

.category-option.active {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border-color: #667eea;
}

.option-icon {
  font-size: 28px;
  filter: grayscale(0.2);
  transition: all 0.3s ease;
}

.category-option.active .option-icon {
  filter: grayscale(0);
  transform: scale(1.1);
}

.option-name {
  font-size: 13px;
  font-weight: 600;
  color: #5f6368;
  transition: all 0.3s ease;
}

.category-option.active .option-name {
  color: #667eea;
  font-weight: 700;
}

.check-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 16px;
  height: 16px;
  color: #667eea;
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
  animation: checkIn 0.3s ease forwards;
}

@keyframes checkIn {
  to {
    stroke-dashoffset: 0;
  }
}

/* ==================== 加载遮罩 ==================== */
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
  color: #667eea;
  font-weight: 500;
}

/* ==================== 响应式适配 ==================== */
@media (max-width: 600px) {
  .publish-content {
    padding: 12px;
    gap: 10px;
  }

  .section-block {
    padding: 14px;
    border-radius: 14px;
  }

  .image-grid {
    gap: 8px;
  }

  .category-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 16px;
  }

  .category-option {
    padding: 14px 10px;
  }

  .option-icon {
    font-size: 24px;
  }
}
</style>
