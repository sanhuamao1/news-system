import $axios from './index';

export async function getUserList(params){
    return $axios.get('/api/getuserlist',params)
}

export async function getCharacters(){
    return $axios.get('/api/getcharacters')
}

//删除用户
export async function deleteUser(params){
    return $axios.get('/api/deleteuser',params)
}
//恢复用户
export async function aliveUser(params){
    return $axios.get('/api/aliveuser',params)
}

//添加用户
export async function addUser(params){
    return $axios.post('/api/addUser',params)
}






