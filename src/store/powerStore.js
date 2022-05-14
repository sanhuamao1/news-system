import { observable,configure, runInAction} from "mobx"
import {getAllModules} from '../request/power'

configure({
    enforceAction:'always'
})

const PowerStore=observable({
    allModules:[],
    requireAllModules(){
        getAllModules().then(res=>{
            if(res.data.status===200){
                runInAction(()=>{
                    this.allModules=res.data.data
                })
            }
        })
    }
},{
    
})

export default PowerStore
