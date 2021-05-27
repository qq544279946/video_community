import axios from './axios';

let prefix = '';

if (process.env.NODE_ENV === 'development') {
    prefix = '/api'
}else{
    prefix = `http://192.168.1.198:3000`
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

// 关注用户
export function watchUser(data) {
    return axios({
        url: `${prefix}/api/watchUser`,
        method: 'post',
        data: data
    })

}

// 获取用户的粉丝和关注量
export function getWatchsAndFans(data) {
    return axios({
        url: `${prefix}/api/getWatchsAndFans`,
        method: 'get',
        params: data
    })

}

// 是否已关注
export function isWatchUser(data) {
    return axios({
        url: `${prefix}/api/isWatchUser`,
        method: 'get',
        params: data
    })

}