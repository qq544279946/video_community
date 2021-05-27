import axios from './axios';

let prefix = '';

if(process.env.NODE_ENV === 'development'){
    prefix = '/api'
}else{
    prefix = `http://192.168.1.198:3000`
}

export function userCollectVideo(data){
    return axios({
        url: `${prefix}/api/userCollectVideo`,
        method: 'post',
        data: data
    })
}

export function isCollect(data){
    return axios({
        url: `${prefix}/api/isCollect`,
        method: 'get',
        params: data
    })
}

export function getCollectCount(data){
    return axios({
        url: `${prefix}/api/getCollectCount`,
        method: 'get',
        params: data
    })
}