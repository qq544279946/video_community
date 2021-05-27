import axios from './axios';

let prefix = '';

if(process.env.NODE_ENV === 'development'){
    prefix = '/api'
}else{
    prefix = `http://192.168.1.198:3000`
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