// 通用请求封装文件
import axios from "axios"; // 引入axios库
import { showToast } from "vant";
import router from "../router/router.js";

export const API_URL = import.meta.env.VITE_API_BASE_URL;
// 创建axios实例
const request = axios.create({
  baseURL: API_URL, // 设置基础请求URL
  timeout: 5000, // 设置请求超时时间
});

const whiteList = ["/user/login", "/user/register"];

// 前置拦截器
request.interceptors.request.use(
  (config) => {
    const isPublic =
      whiteList.some((url) => config.url?.includes(url)) || config.noAuth;
    if (isPublic) {
      return config;
    }
    // 从 localStorage 获取 token
    const token = localStorage.getItem("token");

    // if (!token) {
    //   router.push('/login')
    //   return Promise.reject(new Error('请先登录'))
    // }

    // 方式1：Bearer Token（JWT 标准）
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 后置拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      // 处理错误情况
      return Promise.reject(new Error(res.msg || "Error"));
    }
    // 直接返回响应数据
    return res;
  },
  (error) => {
    // 全局处理
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // 统一登出
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          router.push("/login");
          break;
        case 403:
          showToast("没有权限");
          break;
        case 500:
          showToast("服务器繁忙");
          break;
        default:
          showToast(data.msg || "请求失败");
      }
    } else if (error.request) {
      showToast("网络异常，请检查连接");
    }

    return Promise.reject(error);
  }
);

// 导出
export default request;
