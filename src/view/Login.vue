<script setup>
import request from "../api/request.js";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter()
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)

function login() {
  // 在这里添加登录逻辑，例如表单验证和发送请求
  request
    .post("/user/login", {
      email: username.value,
      password: password.value,
    })
    .then((response) => {
      console.log("登录成功:", response.data);
      alert("登录成功!");
      // 登录成功后可以跳转到主页或其他页面
      router.push("/index");
    })
    .catch((error) => {
      console.error("登录失败:", error);
      alert("登录失败，请检查用户名和密码。");
    });
}
</script>

<template>
  <!-- 登录界面  移动端H5 -->
  <div class="login-page">
    <div class="login-card">
      <div class="logo-section">
        <div class="logo">👋</div>
        <h1 class="title">欢迎回来</h1>
        <p class="subtitle">请登录您的账户</p>
      </div>

      <form class="login-form" @submit.prevent="login">
        <div class="input-group">
          <div class="input-wrapper">
            <span class="icon">👤</span>
            <input
              type="text"
              v-model="username"
              placeholder="请输入邮箱"
              class="input-field"
            />
          </div>
        </div>

        <div class="input-group">
          <div class="input-wrapper">
            <span class="icon">🔒</span>
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="请输入密码"
              class="input-field"
            />
            <span class="toggle-password" @click="showPassword = !showPassword">
              {{ showPassword ? "🙈" : "👁️" }}
            </span>
          </div>
        </div>

        <div class="options">
          <label class="remember">
            <input type="checkbox" v-model="rememberMe" />
            <span>记住我</span>
          </label>
          <a href="#" class="forgot-link">忘记密码？</a>
        </div>

        <button type="submit" class="login-btn" :class="{ loading: isLoading }">
          <span v-if="!isLoading">登 录</span>
          <span v-else class="spinner"></span>
        </button>
      </form>

      <p class="register-link">还没有账户？<a href="/register">立即注册</a></p>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
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

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.remember {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  cursor: pointer;
}

.remember input {
  width: 16px;
  height: 16px;
  accent-color: #667eea;
}

.forgot-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #764ba2;
}

.login-btn {
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
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(102, 126, 234, 0.5);
}

.login-btn:active {
  transform: translateY(0);
}

.login-btn.loading {
  opacity: 0.8;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.divider {
  display: flex;
  align-items: center;
  margin: 10px 0;
  color: #999;
  font-size: 13px;
}

.divider::before,
.divider::after {
  content: "";
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
}

.social-btn:hover {
  background: #f8f9fa;
  border-color: #667eea;
  transform: translateY(-1px);
}

.social-btn.wechat {
  color: #07c160;
}

.social-btn.phone {
  color: #667eea;
}

.register-link {
  text-align: center;
  margin-top: 25px;
  color: #666;
  font-size: 14px;
}

.register-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
}

.register-link a:hover {
  text-decoration: underline;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .login-card {
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
}
</style>
