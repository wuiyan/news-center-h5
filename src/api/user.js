import request from "./request";

// 用户登录
export function login(data) {
    return request.post('/user/login', data);
}

// 获取用户信息
export async function getUserInfo(userId) {
    return request.get(`/user/info/${userId}`);
}

// 更新用户信息（PUT /user/update）
export function updateUser(data) {
    // data 应包含 id 及需要更新的字段
    return request.put('/user/update', data);
} 