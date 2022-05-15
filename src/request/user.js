import $axios from './index';

// 获取用户列表
export async function getUserList(params){
    return $axios.get('/api/getuserlist',params)
}

//获取角色选项
export async function getCharactersOptions(){
    return $axios.get('/api/getcharactersoptions')
}

//删除用户
export async function deleteUser(params){
    return $axios.get('/api/deleteuser',params)
}
//停用用户
export async function stopUser(params){
    return $axios.get('/api/stopuser',params)
}
//恢复用户
export async function aliveUser(params){
    return $axios.get('/api/aliveuser',params)
}

//添加用户
export async function addUser(data){
    return $axios.post('/api/adduser',data)
}

//添加用户角色
export async function updateUser(data){
    return $axios.post('/api/updateuser',data)
}







