// 信息管理
import request from "./request.js";

// 获取信息分类
export function getNewsCategories() {
    return request.get('/category/list');
}

// 获取信息列表
export function getNewsList() {
    return request.get('/news/list');
}

// 搜索信息
export function searchNews(keyword) {
    return request.get(`/news/search`, { params: { keyword } });
}

// 获取信息详情
export function getNewsDetail(id) {
    return request.get(`/news/detail/${id}`);
}

// 点赞信息
export function likeNews(id) {
    return request.post(`/news/like/${id}`);
}

// 收藏信息
export function collectNews(id) {
    return request.post(`/news/collect/${id}`);
}

// 发布信息
export function publishNews(data) {
    return request.post('/news/publish', data);
}