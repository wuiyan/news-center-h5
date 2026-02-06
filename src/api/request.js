// 通用请求封装文件
import axios from "axios"; // 引入axios库

export const API_URL = import.meta.env.VITE_API_BASE_URL;
// 创建axios实例
const request = axios.create({
  baseURL: API_URL, // 设置基础请求URL
  timeout: 5000, // 设置请求超时时间
});

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
