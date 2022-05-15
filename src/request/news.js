import $axios from './index';

export async function getNewsSort(){
    return $axios.get('/api/getnewssort')
}

export async function createNews(data){
    return $axios.post('/api/createnews',data)
}

export async function getDraftList(params){
    return $axios.get('/api/getDraftList',params)
}

export async function deleteDraft(params){
    return $axios.get('/api/deletedraft',params)
}

export async function submitDraft(params){
    return $axios.get('/api/submitdraft',params)
}

export async function getNewsDetail(params){
    return $axios.get('/api/getnewsdetail',params)
}

export async function updateDraft(data){
    return $axios.post('/api/updatedraft',data)
}
