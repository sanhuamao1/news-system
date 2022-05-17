import $axios from './index';

// 新闻类别
export async function getNewsSort(){
    return $axios.get('/api/getnewssort')
}

// 新建草稿
export async function createNews(data){
    return $axios.post('/api/createnews',data)
}

// 草稿箱列表
export async function getDraftList(params){
    return $axios.get('/api/getDraftList',params)
}

// 删除草稿
export async function deleteDraft(params){
    return $axios.get('/api/deletedraft',params)
}

// 提交草稿去审核
export async function submitDraft(params){
    return $axios.get('/api/submitdraft',params)
}

// 获取新闻详情
export async function getNewsDetail(params){
    return $axios.get('/api/getnewsdetail',params)
}

// 更新草稿
export async function updateDraft(data){
    return $axios.post('/api/updatedraft',data)
}

// 审核列表
export async function getCheckList(params){
    return $axios.get('/api/getchecklist',params)
}

// 撤回审核
export async function drawbackCheck(params){
    return $axios.get('/api/drawbackcheck',params)
}

// 获取审核列表（管理员版）
export async function getCheckListForManager(params){
    return $axios.get('/api/getchecklistformanager',params)
}



// 获取发布列表
export async function getPublishList(){
    return $axios.get('/api/getpublishlist')
}


// 审核通过
export async function agreeCheck(data){
    return $axios.post('/api/agreecheck',data)
}

// 审核不通过
export async function opposeCheck(data){
    return $axios.post('/api/opposecheck',data)
}

// 获取审核记录
export async function getCheckHistory(params){
    return $axios.get('/api/getcheckhistory',params)
}

