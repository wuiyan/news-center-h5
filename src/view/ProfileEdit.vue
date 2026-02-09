<template>
  <div class="profile-edit-page">
    <div class="nav-header global-nav">
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
      <h1 class="page-title">编辑资料</h1>
    </div>
    <div class="page-container">
      <div class="edit-card">
        <div class="card-header">
          <span class="header-icon">🚀</span>
          <h2>编辑资料</h2>
          <p class="header-desc">完善您的个人档案</p>
        </div>

        <div class="form-section">
          <div class="avatar-upload">
            <div
              class="avatar-preview"
              :style="
                form.avatar
                  ? {
                      backgroundImage: `url(${form.avatar})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : { background: 'linear-gradient(135deg, #667eea, #764ba2)' }
              "
            >
              {{ form.name?.charAt(0) || "👤" }}
            </div>
            <div class="upload-btn-wrapper">
              <button
                type="button"
                class="upload-btn"
                @click="triggerFileInput"
              >
                <span class="upload-icon">📷</span>
                选择图片
              </button>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleFileChange"
                hidden
              />
            </div>
          </div>

          <div class="input-wrapper">
            <label class="input-label">
              <span class="label-icon">👤</span>
              昵称
            </label>
            <input
              v-model="form.name"
              type="text"
              class="custom-input"
              placeholder="请输入昵称"
              :class="{ error: errors.name }"
              @input="validateField('name')"
            />
            <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
          </div>

          <div class="input-wrapper">
            <label class="input-label">
              <span class="label-icon">✉️</span>
              邮箱
            </label>
            <input
              v-model="form.email"
              type="email"
              class="custom-input"
              placeholder="请输入邮箱"
              :class="{ error: errors.email }"
              @input="validateField('email')"
            />
            <span v-if="errors.email" class="error-msg">{{
              errors.email
            }}</span>
          </div>

          <button
            type="button"
            class="save-btn"
            @click="handleSave"
            :disabled="isSaving"
          >
            {{ isSaving ? "保存中..." : "保存更改" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import { updateUser } from '../api/user.js';

const router = useRouter();
const fileInput = ref(null);

const form = ref({
  id: null,
  name: '',
  email: '',
  password: '',
  avatar: '' // 占位头像数据
});


const errors = ref({
  name: '',
  email: ''
});

const isSaving = ref(false);

onMounted(() => {
  loadUserData();
});

const loadUserData = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      form.value = {
        id: user.id || null,
        name: user.name || '',
        email: user.email || '',
        password: user.password || '',
        avatar: user.avatar || user.avatarUrl || ''
      };
    } catch (e) {
      console.error('解析用户数据失败:', e);
    }
  }
};

const validateField = (field) => {
  if (field === 'name') {
    if (!form.value.name.trim()) {
      errors.value.name = '昵称不能为空';
      return false;
    }
    if (form.value.name.length < 2) {
      errors.value.name = '昵称至少2个字符';
      return false;
    }
    if (form.value.name.length > 20) {
      errors.value.name = '昵称不能超过20个字符';
      return false;
    }
    errors.value.name = '';
  }

  // if (field === 'email') {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!form.value.email.trim()) {
  //     errors.value.email = '邮箱不能为空';
  //     return false;
  //   }
  //   if (!emailRegex.test(form.value.email)) {
  //     errors.value.email = '请输入有效的邮箱地址';
  //     return false;
  //   }
  //   errors.value.email = '';
  // }

  return true;
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('请选择图片文件');
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    showToast('图片大小不能超过2MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    form.value.avatar = e.target.result;
  };
  reader.readAsDataURL(file);
};

const validateAll = () => {
  return validateField('name') && validateField('email');
};

const goBack = () => {
  router.back();
};

const handleSave = async () => {
  if (!validateAll()) {
    showToast('请检查输入内容');
    return;
  }

  isSaving.value = true;

  try {
    const payload = {
      id: form.value.id,
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      avatar: form.value.avatar || undefined
    };

    const res = await updateUser(payload);

    // 统一提取数据和判断成功
    let returned = null;
    let isSuccess = false;
    let errorMsg = '保存失败，请重试';

    if (res?.code === 200) {
      // 标准格式 {code, data, msg}
      returned = res.data;
      isSuccess = true;
    } else if (res && !res.code) {
      // 纯数据格式（拦截器彻底解包）
      returned = res;
      isSuccess = true;
    } else {
      // 失败情况
      errorMsg = res?.msg || '保存失败，请重试';
    }

    if (!isSuccess || !returned) {
      showToast(errorMsg);
      return;  // 失败直接返回，不执行后续
    }

    console.log('返回数据:', returned);

    // 合并到本地缓存（只有成功才执行到这里）
    const raw = localStorage.getItem('user');
    let localObj = {};
    if (raw) {
      try { 
        localObj = JSON.parse(raw); 
      } catch (_) { 
        localObj = typeof raw === 'string' ? { id: raw } : {}; 
      }
    }

    const updatedFields = {
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.email !== undefined && { email: payload.email }),
      ...(payload.avatar !== undefined && { avatar: payload.avatar })
    };

    // 优先使用服务器返回的值
    if (returned.name !== undefined) updatedFields.name = returned.name;
    if (returned.email !== undefined) updatedFields.email = returned.email;
    if (returned.avatar !== undefined) updatedFields.avatar = returned.avatar;

    const merged = { 
      ...localObj, 
      id: payload.id ?? localObj.id, 
      ...updatedFields 
    };

    localStorage.setItem('user', JSON.stringify(merged));

    showToast('保存成功');
    router.push('/profile');

  } catch (e) {
    console.error('保存失败:', e);
    showToast('保存失败，请重试');
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.profile-edit-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: cover;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  padding-bottom: 20px;
}

.page-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  margin-top: 72px; /* 给固定顶部导航预留空间 */
  padding: 8px 16px;
}

/* 正文卡片样式：白色背景 + 圆角 + 投影 */
.edit-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 18px;
  padding: 28px 20px 36px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06);
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 8px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nav-header.global-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
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
  margin-left: 8px;
}

.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.header-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
}

.card-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #202124;
  margin-bottom: 8px;
}

.header-desc {
  font-size: 14px;
  color: #5f6368;
  font-weight: 400;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: center;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  border: 3px solid rgba(102, 126, 234, 0.3);
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-btn-wrapper {
  display: flex;
  align-items: center;
}

.upload-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.upload-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.upload-btn:active {
  transform: translateY(0) scale(0.98);
}

.upload-icon {
  font-size: 16px;
}

.input-wrapper {
  position: relative;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #202124;
  margin-bottom: 8px;
}

.label-icon {
  font-size: 16px;
}

.custom-input {
  width: 100%;
  padding: 14px 16px;
  padding-left: 44px;
  background: #f5f6f8;
  border: 2px solid transparent;
  border-radius: 14px;
  font-size: 14px;
  color: #202124;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.custom-input::placeholder {
  color: #999;
}

.custom-input:focus {
  background: #fff;
  border-color: #667eea;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08),
    0 0 0 3px rgba(102, 126, 234, 0.1);
}

.custom-input.error {
  border-color: #ff6b6b;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05),
    0 0 0 3px rgba(255, 107, 107, 0.1);
}

.error-msg {
  position: absolute;
  right: 0;
  bottom: -20px;
  font-size: 11px;
  color: #ff6b6b;
  font-weight: 500;
}

.save-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  margin-top: 8px;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
}

.save-btn:active:not(:disabled) {
  transform: translateY(-2px) scale(0.98);
  transition: transform 0.1s;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 600px) {
  .page-container {
    margin-top: 64px;
  }

  .edit-card {
    padding: 24px 20px;
    border-radius: 20px;
  }

  .card-header h2 {
    font-size: 22px;
  }

  .header-icon {
    font-size: 40px;
  }

  .avatar-preview {
    width: 90px;
    height: 90px;
    font-size: 40px;
  }
}
</style>
