
import { message} from 'antd';
import axios from 'axios'
import Qs from 'qs'
import AdminStore from '@/tstore/adminStore'

const $axios = axios.create({
    baseURL: process.env.REACT_APP_URL,
    timeout: 1000,
});

$axios.interceptors.request.use((config)=> {
    AdminStore.setSpinning(true)
    config.headers.Authorization='Bearer ' + localStorage.getItem('token')
    return config
  }, function (error) {
    return Promise.reject(error);
});

$axios.interceptors.response.use((res)=> {
    if(res.data.status===200&&res.data.msg!=='ok'){
        message.success(res.data.msg)
    }else if(res.data.status!==200){  
        if(res.data.msg==='身份认证失败！'){
            window.location.href='/#/login'
        }else{
            message.error(res.data.msg)
        }
    }
    AdminStore.setSpinning(false)
    return res;
  }, function (error) {
    message.error(error);
    AdminStore.setSpinning(false)
    return Promise.reject(error);   
});

export default {
    post(url,data){
        return $axios({
            method:'post',
            url,
            data:Qs.stringify(data),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
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