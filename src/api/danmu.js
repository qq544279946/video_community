import axios from './axios';

let prefix = '';

if(process.env.NODE_ENV === 'development'){
    prefix = '/api'
}else{
    prefix = `http://192.168.1.198:3000`
}

export function sendDanmu(data){
    console.log(data)
    return axios({
        url: `${prefix}/api/sendDanmu`,
        method: 'post',
        data: data
    })
}

export function getDanmu(data){
    return axios({
        url: `${prefix}/api/getDanmu`,
        method: 'get',
        params: data
    })
}