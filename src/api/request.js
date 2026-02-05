// 通用请求封装文件
import axios from 'axios';      // 引入axios库

// 创建axios实例
const request = axios.create({
    baseURL: 'http://192.168.1.13:8080/api', // 设置基础URL
    // baseURL: 'https://news-center-production.up.railway.app/api', // 设置基础URL
    timeout: 5000,                     // 设置请求超时时间
});

// 导出
export default request;