
import { message} from 'antd';
import axios from 'axios'
import Qs from 'qs'


const $axios = axios.create({
    baseURL: process.env.REACT_APP_URL,
    timeout: 1000,
    headers: { 'Authorization': 'Bearer ' + localStorage.token?localStorage.token:'' }
});

$axios.interceptors.request.use((config)=> {
    const token=localStorage.getItem('token')
    config.headers.Authorization='Bearer ' + token
    return config
  }, function (error) {
    return Promise.reject(error);
});

$axios.interceptors.response.use((res)=> {
    if(res.data.status===200&&res.data.msg!=='ok'){
        message.success(res.data.msg)
    }else if(res.data.status!==200){  
        message.error(res.data.msg)
    }
    return res;
  }, function (error) {
    message.error(error);
    return Promise.reject(error);
});

export default {
    post(url,data){
        return $axios({
            method:'post',
            url,
            data:Qs.stringify(data),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
    },
    get(url,params){
        return $axios({
            method:'get',
            url,
            params
        })
    }
}