import request from "./request";

// 用户登录
export function login(data) {
    return request.post('/user/login', data);
}

// 获取用户信息
export async function getUserInfo(userId) {
    return request.get(`/user/info/${userId}`);
}