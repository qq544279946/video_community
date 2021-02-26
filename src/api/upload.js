import axios from './axios';

let prefix = '';

if(process.env.NODE_ENV === 'development'){
    prefix = '/api'
}

export function upload(formData){
    return axios({
        url: `${prefix}/api/upload`,
        method: 'post',
        data: formData
    })
}