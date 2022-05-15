import { observable,configure, runInAction,action} from "mobx"
import {getAllOpenModules,getAllModulesAndRoles} from '../request/power'

configure({
    enforceAction:'always'
})

const PowerStore=observable({
    allOpenModules:[],
    allModulesAndRoles:[],
    requireAllOpenModules(){
        getAllOpenModules().then(res=>{
            if(res.data.status===200){
                runInAction(()=>{
                    this.allOpenModules=res.data.data
                })
            }
        })
    },
    requireAllModulesAndRoles(){
        getAllModulesAndRoles().then(res=>{
            if(res.data.status===200){
                runInAction(()=>{
                    this.allModulesAndRoles=res.data.data
                })
            }
        })
    }
},{
    requireAllModulesAndRoles:action,
    requireAllOpenModules:action
})

export default PowerStore
