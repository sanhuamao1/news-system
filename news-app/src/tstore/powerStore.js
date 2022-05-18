import { observable,configure, runInAction } from "mobx"
import { getCharacters,getAllOpenModules} from '@/request/power'

configure({
    enforceAction:'always'
})

const PowerStore=observable({
    charactersList:[],//角色列表
    isAddVisible:false,//添加角色模态框
    editInfo:"",//编辑信息

    //分页
    currentPage:1,
    pageSize:5,
    total:0,
    
    // 模态框
    current:0,//进度
    checkedModules:[],//选中的模块
    moduleRoles:[],//模块对应的权限
    checkedRoles:[],//选中的权限
    allOpenModules:[],//所有可选模块



    setIsAddVisible(boolean){
        this.isAddVisible=boolean
    },
    setEditInfo(string){
        this.editInfo=string
    },
    setCurrentPage(number){
        this.currentPage=number
    },
    
    
    //获取角色列表
    async requireCharacters(type){
        const res=await getCharacters({
            currentPage:type===''?1:this.currentPage,
            pageSize:this.pageSize,
        })
        runInAction(()=>{
            this.charactersList=res.data.data
            this.total=res.data.total
        })  
    },

    // 获取所有可选模块
    async requireAllOpenModules(){
        const res=await getAllOpenModules()
        runInAction(()=>{
            this.allOpenModules=res.data.data
        })
    },

    // 调整进度
    setCurrent(number){
        this.current=number
    },
    // 已选模块
    setCheckedModules(arr){
        this.checkedModules=arr
    },
    // 已选权限
    setCheckedRoles(arr){
        this.checkedRoles=arr
        console.log(this.checkedRoles)

    },

    // 获取模块对应的权限
    setModuleRoles(arr){
        this.moduleRoles=arr
    }

})


export default PowerStore
