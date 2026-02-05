<script setup>
import request from '../api/request.js'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast, showFailToast } from 'vant'
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)

// 密码强度计算
const passwordStrength = computed(() => {
  const pwd = password.value
  if (!pwd) return 0
  let strength = 0
  if (pwd.length >= 8) strength++
  if (/[A-Z]/.test(pwd)) strength++
  if (/[0-9]/.test(pwd)) strength++
  if (/[^A-Za-z0-9]/.test(pwd)) strength++
  return strength
})

const strengthText = computed(() => {
  const texts = ['', '弱', '中', '强', '非常强']
  return texts[passwordStrength.value]
})

const strengthColor = computed(() => {
  const colors = ['', '#ff4757', '#ffa502', '#2ed573', '#1e90ff']
  return colors[passwordStrength.value]
})

function register() {
  // 表单验证
  if (!name.value || !email.value || !password.value) {
    showFailToast('请填写所有必填项')
    return
  }
  
  if (password.value !== confirmPassword.value) {
    showFailToast('两次输入的密码不一致')
    return
  }


  isLoading.value = true
  
  request.post('/user/register', {
    name: name.value,
    email: email.value,
    password: password.value,
  }).then(response => {
    console.log('注册成功:', response.data);
    showSuccessToast('注册成功！即将跳转到登录页面...');
    // 注册成功后跳转到登录界面
    router.push('/login')
  }).catch(error => {
    console.error('注册失败:', error);
    showFailToast('注册失败，请检查信息是否正确。');
  }).finally(() => {
    isLoading.value = false
  });
}
</script>

<template>
  <!-- 注册界面 移动端H5 -->
  <div class="register-page">
    <div class="register-card">
      <div class="logo-section">
        <div class="logo">🚀</div>
        <h1 class="title">创建账户</h1>
        <p class="subtitle">开始您的精彩旅程</p>
      </div>
      
      <form class="register-form" @submit.prevent="register">
        <!-- 昵称 -->
        <div class="input-group">
          <div class="input-wrapper">
            <span class="icon">👤</span>
            <input 
              type="text" 
              v-model="name" 
              placeholder="请输入昵称"
              class="input-field"
              maxlength="20"
            />
          </div>
        </div>

        <!-- 邮箱 -->
        <div class="input-group">
          <div class="input-wrapper">
            <span class="icon">✉️</span>
            <input 
              type="email" 
              v-model="email" 
              placeholder="请输入邮箱地址"
              class="input-field"
            />
          </div>
        </div>

        <!-- 密码 -->
        <div class="input-group">
          <div class="input-wrapper">
            <span class="icon">🔒</span>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="password" 
              placeholder="请输入密码（至少8位）"
              class="input-field"
              maxlength="20"
            />
            <span class="toggle-password" @click="showPassword = !showPassword">
              {{ showPassword ? '🙈' : '👁️' }}
            </span>
          </div>
          <!-- 密码强度指示器 -->
          <div class="password-strength" v-if="password">
            <div class="strength-bars">
              <div 
                v-for="i in 4" 
                :key="i"
                class="strength-bar"
                :class="{ active: i <= passwordStrength }"
                :style="{ backgroundColor: i <= passwordStrength ? strengthColor : '#e0e0e0' }"
              ></div>
            </div>
            <span class="strength-text" :style="{ color: strengthColor }">{{ strengthText }}</span>
          </div>
        </div>

        <!-- 确认密码 -->
        <div class="input-group">
          <div class="input-wrapper">
            <span class="icon">🔐</span>
            <input 
              :type="showConfirmPassword ? 'text' : 'password'" 
              v-model="confirmPassword" 
              placeholder="请再次输入密码"
              class="input-field"
              maxlength="20"
            />
            <span class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
              {{ showConfirmPassword ? '🙈' : '👁️' }}
            </span>
          </div>
          <div class="password-match" v-if="confirmPassword">
            <span v-if="password === confirmPassword" class="match-success">✓ 密码一致</span>
            <span v-else class="match-error">✗ 密码不一致</span>
          </div>
        </div>


        <button type="submit" class="register-btn" :class="{ loading: isLoading }" :disabled="isLoading">
          <span v-if="!isLoading">立即注册</span>
          <span v-else class="spinner"></span>
        </button>

      </form>

      <p class="login-link">
        已有账户？<a href="/">立即登录</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.register-page {
  min-height: 100vh;
  max-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.register-card {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px 30px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-section {
  text-align: center;
  margin-bottom: 35px;
}

.logo {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  margin: 0 auto 20px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 14px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  position: relative;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 16px;
  padding: 0 16px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.input-wrapper:focus-within {
  background: #fff;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.icon {
  font-size: 18px;
  margin-right: 12px;
  opacity: 0.6;
}

.input-field {
  flex: 1;
  border: none;
  background: transparent;
  padding: 16px 0;
  font-size: 15px;
  color: #333;
  outline: none;
}

.input-field::placeholder {
  color: #aaa;
}

.toggle-password {
  cursor: pointer;
  font-size: 18px;
  opacity: 0.6;
  transition: opacity 0.2s;
  padding: 5px;
}

.toggle-password:hover {
  opacity: 1;
}

/* 密码强度指示器 */
.password-strength {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  padding: 0 4px;
}

.strength-bars {
  display: flex;
  gap: 4px;
  flex: 1;
}

.strength-bar {
  height: 4px;
  flex: 1;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.strength-text {
  font-size: 12px;
  font-weight: 500;
  min-width: 48px;
  text-align: right;
}

/* 密码匹配提示 */
.password-match {
  margin-top: 6px;
  padding: 0 4px;
  font-size: 12px;
}

.match-success {
  color: #2ed573;
  font-weight: 500;
}

.match-error {
  color: #ff4757;
  font-weight: 500;
}

.options {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 13px;
  margin-top: 4px;
}

.remember {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  cursor: pointer;
  line-height: 1.4;
}

.remember input {
  width: 16px;
  height: 16px;
  accent-color: #667eea;
  flex-shrink: 0;
}

.terms-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.register-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
  margin-top: 8px;
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(102, 126, 234, 0.5);
}

.register-btn:active {
  transform: translateY(0);
}

.register-btn.loading {
  opacity: 0.8;
  cursor: not-allowed;
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
  color: #999;
  font-size: 13px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ddd, transparent);
}

.divider span {
  padding: 0 15px;
}

.social-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.social-btn {
  padding: 12px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.social-btn:hover {
  background: #f8f9fa;
  border-color: #667eea;
  transform: translateY(-1px);
}

.social-icon {
  font-size: 16px;
}

.social-btn.wechat {
  color: #07c160;
}

.social-btn.phone {
  color: #667eea;
}

.login-link {
  text-align: center;
  margin-top: 25px;
  color: #666;
  font-size: 14px;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
}

.login-link a:hover {
  text-decoration: underline;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .register-card {
    padding: 30px 20px;
    border-radius: 20px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .logo {
    width: 70px;
    height: 70px;
    font-size: 30px;
  }
  
  .social-login {
    grid-template-columns: 1fr;
  }
  
  .register-form {
    gap: 14px;
  }
}
</style>