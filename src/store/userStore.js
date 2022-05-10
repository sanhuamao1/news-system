import { observable,configure, runInAction,action } from "mobx"
import {getCharacters} from '../request/user'

configure({
    enforceAction:'always'
})

const UserStore=observable({
    characters:null,
    characterList:["超级管理员","新闻编辑者","新闻审核员","新闻发布者","新闻运营"],

    async requireCharacters(){
        const res=await getCharacters()
        if(res.data.status===200){

            runInAction(()=>{
                this.characters=res.data.data
            })
        }
    },
},{
    requireCharacters:action,
})

export default UserStore
