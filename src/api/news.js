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

