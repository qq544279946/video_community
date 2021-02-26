import axios from './axios';

let prefix = '';

if(process.env.NODE_ENV === 'development'){
    prefix = '/api'
}

export function getCategory(){
    return axios({
        url: `${prefix}/api/getCategory`,
        method: 'get',
    })
}