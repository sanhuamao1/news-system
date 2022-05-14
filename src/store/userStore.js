import { observable,configure, runInAction,action } from "mobx"
import {getCharactersOptions} from '../request/user'
import {AdminStore} from './index'

configure({
    enforceAction:'always'
})

const UserStore=observable({
    characterSearchOptions:null,//用于查询的
    characterAddOptions:null,//用于选择添加的
    characterList:["超级管理员","新闻编辑者","新闻审核员","新闻发布者","新闻运营"],
    async requireCharacters(){
        const res=await getCharactersOptions()
        if(res.data.status===200){
            runInAction(()=>{
                this.characterSearchOptions=[{id:0,name:'全部'},...res.data.data]
                this.characterAddOptions=AdminStore.userInfo.character_id===1?res.data.data:res.data.data.filter(item=>item.id!==1)
            })
        }
    },
},{
    requireCharacters:action,
})

export default UserStore
