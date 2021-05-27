import axios from './axios';

let prefix = '';

if(process.env.NODE_ENV === 'development'){
    prefix = '/api'
}else{
    prefix = `http://192.168.1.198:3000`
}

// 首页推荐
export function getHomeVideos(data){
    return axios({
        url: `${prefix}/api/getHomeVideo`,
        method: 'post',
        data: data
    })
}

// 根据视频id获取视频信息
export function getViewInfoByVideoId(params){
    return axios({
        url: `${prefix}/api/getViewInfoByVideoId`,
        method: 'get',
        params: params
    })
}

// 根据用户id获取用户的所有视频信息
export function getVideoListByUserId(userId){
    return axios({
        url: `${prefix}/api/getVideoListByUserId`,
        method: 'get',
        params: {
            userId: userId
        }
    })
}

// 视频播放量+1
export function playCountAdd(video_id){
    return axios({
        url: `${prefix}/api/playCountAdd`,
        method: 'get',
        params: {
            videoId: video_id
        }
    })
}

// 获取分区视频
export function getVideoListByCategoryId(data){
    return axios({
        url: `${prefix}/api/getVideoListByCategoryId`,
        method: 'get',
        params: data
    })
}

// 获取分区更多最新视频
export function getMoreVideoListByCategory(data){
    return axios({
        url: `${prefix}/api/getMoreVideoListByCategory`,
        method: 'get',
        params: data
    })
}

// 搜索视频
export function searchVideo(data){
    return axios({
        url: `${prefix}/api/searchVideo`,
        method: 'get',
        params: data
    })
}

// 点赞
export function like(data){
    return axios({
        url: `${prefix}/api/like`,
        method: 'post',
        data: data
    })
}

export function isLike(data){
    return axios({
        url: `${prefix}/api/isLike`,
        method: 'post',
        data: data
    })
}

export function getLikeCount(data){
    return axios({
        url: `${prefix}/api/getLikeCount`,
        method: 'get',
        params: data
    })
}