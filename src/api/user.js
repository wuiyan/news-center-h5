import request from "./request";

// 用户登录
export function login(data) {
    return request.post('/user/login', data);
}

// 获取用户信息
export async function getUserInfo() {
    return request.get('/user/me');
}

// 更新用户信息（PUT /user/update）
export function updateUser(data) {
    // data 应包含 id 及需要更新的字段
    return request.put('/user/update', data);
}

// 关注/取消关注
export function followUser(userId) {
    return request.post(`/user/follow/${userId}`);
}

// 我的关注列表
export function getFollowingList() {
    return request.get('/user/following');
}

// 我的粉丝列表
export function getFollowersList() {
    return request.get('/user/followers');
}