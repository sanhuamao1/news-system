import $axios from './index';

export async function loginRequest(data){
    return $axios.post('/admin/login',data)
}

export async function registerRequest(data){
    return $axios.post('/admin/register',data)
}

export function getMenus(){
    return $axios.get('/api/getmenulist')
}