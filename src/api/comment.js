import axios from './axios';

let prefix = '';

if(process.env.NODE_ENV === 'development'){
    prefix = '/api'
}

export function addComment(data){
    return axios({
        url: `${prefix}/api/addComment`,
        method: 'post',
        data: data
    })
}

export function getCommentByVideoId(data){
    return axios({
        url: `${prefix}/api/getCommentByVideoId`,
        method: 'post',
        data: data
    })
}