import $axios from './index';
// 发布列表
export async function getPublishList(params){
    return $axios.get('/api/getpublishlist',params)
}

// 发布新闻
export async function publishNews(params){
    return $axios.get('/api/publishnews',params)
}

// 下线新闻
export async function offlineNews(params){
    return $axios.get('/api/offlinenews',params)
}
