import { observable,configure, runInAction } from "mobx"
import { getCharactersOptions , getUserList} from '@/request/user'

configure({
    enforceAction:'always'
})

const UserStore=observable({
    isAddVisible:false,//添加模态框
    isEditVisible:false,//编辑模态框
    characterOptions:[],//角色选项
    userList:[],//用户列表
    keyValue:null,//搜索关键词
    userInfo:"",//用户编辑信息
    
    // 分页相关
    pageSize:5,
    currentPage:1,
    total:0,
    
    setCurrentPage(number){
        this.currentPage=number
    },
    setKeyValue(value){
        this.keyValue=value
    },
    setIsAddVisible(boolean){
        this.isAddVisible=boolean
    },
    setIsEditVisible(boolean){
        this.isEditVisible=boolean
    },
    setUserInfo(string){
        this.userInfo=string
    },
    

    async requireCharacters(){
        const res=await getCharactersOptions()
        runInAction(()=>{
            this.characterOptions=res.data.data
        })
    },

    async requireUserList(type){
        const res=await getUserList({
            currentPage:type===''?1:this.currentPage,
            pageSize:this.pageSize,
            ...this.keyValue
        })
        runInAction(()=>{
            this.userList=res.data.data
            this.total=res.data.total
        })
    }
})


export default UserStore
