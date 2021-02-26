import axios from 'axios';
import qs from 'qs'

const service = axios.create({
    baseURL: '',
})

service.interceptors.request.use(config=>{
    config.paramsSerializer = function(params){
        return qs.stringify(params,{
            indices: false
        })
    }
    return config
})

service.interceptors.response.use(res => {
    return res.data;
})

export default service