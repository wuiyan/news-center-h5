// 通用请求封装文件
import axios from "axios"; // 引入axios库

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
    // 直接返回响应数据
    return response.data;
  },
  (error) => {
    // 处理响应错误
    return Promise.reject(error);
  }
);

// 导出
export default request;
