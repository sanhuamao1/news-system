import { observable,configure, runInAction,action } from "mobx"
import {getModulesAndRolesById,getUserInfo,loginRequest} from '../request/admin'

configure({
    enforceAction:'always'
})


const AdminStore=observable({
    characterList:["超级管理员","新闻编辑者","新闻审核员","新闻发布者","新闻运营"],
    modules:localStorage.getItem('modules')?JSON.parse(localStorage.getItem('modules')):[],
    userInfo:localStorage.getItem('userinfo')?JSON.parse(localStorage.getItem('userinfo')):'',
    token:localStorage.getItem('token')?localStorage.getItem('token'):'',

    async requireModules(){
        const res=await getModulesAndRolesById()
        if(res.data.status===200){
            localStorage.setItem('modules',JSON.stringify(res.data.data)) 
            runInAction(()=>{
                this.modules=res.data.data
            })
        }
    },

    async requireUserInfo(){
        const res=await getUserInfo()
        if(res.data.status===200){
            localStorage.setItem('userinfo',JSON.stringify(res.data.data)) 
            runInAction(()=>{
                this.userInfo=JSON.parse(JSON.stringify(res.data.data))
            })
        }
    },

    async requireLogin(value){
        const res=await loginRequest(value)
        if(res.data.status===200){
            localStorage.setItem('token',res.data.token)
            this.token=res.data.token
        }  
        const data=await this.requireModules()
        await this.requireUserInfo()
        console.log(data)
        window.location.href = '/#/home';
    }
},{
    requireModules:action,
    requireUserInfo:action,
    requireLogin:action,
})

export default AdminStore