import axios from './axios';

let prefix = '';

if(process.env.NODE_ENV === 'development'){
    prefix = '/api'
}else{
    prefix = `http://192.168.1.198:3000`
}

export function getCategory(){
    return axios({
        url: `${prefix}/api/getCategory`,
        method: 'get',
    })
}