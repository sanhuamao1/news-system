import $axios from './index';

//获取角色
export async function getCharacters(){
    return $axios.get('/api/getcharacters')
}
// 停用角色
export async function stopCharacter(params){
    return $axios.get('/api/stopcharacter',params)
}
// 恢复角色
export async function aliveCharacter(params){
    return $axios.get('/api/alivecharacter',params)
}
// 删除角色
export async function deleteCharacter(data){
    return $axios.get('/api/deletecharacter',data)
}




// 添加角色-获取所有模块
export async function getAllModules(){
    return $axios.get('/api/getallmodules')
}


// 添加角色-判断角色是否存在
export async function isNewCharaterExist(params){
    return $axios.get('/api/isnewcharaterexist',params)
}

// 添加角色-根据选中模块，过滤出有权限的模块
export async function getRolesByModule(params){
    return $axios.get('/api/getrolesbymodule',params)
}

// 添加角色
export async function addCharacter(data){
    return $axios.post('/api/addcharacter',data)
}


// 编辑角色-判断角色是否存在
export async function isCharaterExist(params){
    return $axios.get('/api/ischaracterexist',params)
}

// 编辑角色
export async function updateCharacter(data){
    return $axios.post('/api/updatecharacter',data)
}

// 根据角色id获取角色权限和模块
export async function getModuleidAndRoleidByid(params){
    return $axios.get('/api/getmoduleidandroleid-byid',params)
}