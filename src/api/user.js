import axios from './axios';

let prefix = '';

if (process.env.NODE_ENV === 'development') {
    prefix = '/api'
}

// 登录
export function login(params) {
    return axios({
        url: `${prefix}/api/login`,
        method: 'post',
        data: params
    })
}

// 用户退出
export function logout() {
    return axios({
        url: `${prefix}/api/logout`,
        method: 'get',
    })
}

// 根据userId获取用户信息
export function getUserInfo(userId) {
    return axios({
        url: `${prefix}/api/getUserInfo`,
        method: 'get',
        params: {
            userId: userId
        }
    })
}
// 更新用户信息
export function updateUserInfo(data) {
    return axios({
        url: `${prefix}/api/updateUserInfo`,
        method: 'post',
        data: data
    })
}

// 用户注册
export function registerUser(data) {
    return axios({
        url: `${prefix}/api/registerUser`,
        method: 'post',
        data: data
    })
}

// 搜索用户信息
export function searchUsers(data) {
    return axios({
        url: `${prefix}/api/searchUsers`,
        method: 'get',
        params: data
    })

}