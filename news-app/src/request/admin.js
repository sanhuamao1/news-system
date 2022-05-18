import $axios from './index';

export async function loginRequest(data){
    return $axios.post('/admin/login',data)
}

export async function registerRequest(data){
    return $axios.post('/admin/register',data)
}

export async function getModulesAndRolesById(){
    return $axios.get('/api/getmodulesandroles-byid')
}

export async function getUserInfo(){
    return $axios.get('/api/getuserinfo')
}

export async function updateUserInfo(data){
    return $axios.post('/api/updateuserinfo',data)
}