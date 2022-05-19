
# 引言

本项目是跟着[b站一个视频做的新闻管理系统](https://www.bilibili.com/video/BV1dP4y1c7qd?spm_id_from=333.1007.top_right_bar_window_custom_collection.content.click)，原视频没有做后端部分。我在此基础上自己构建了数据库，写了接口服务，同时对原本的页面展示进行了部分修改。另外，原视频用的是redux管理状态，本项目用的是mobx。[项目的所有源码都在github中](https://github.com/sanhuamao1/news-system)。



# 一 项目组成

- news-app：前端
    ```
    npm i
    npm start
    ```
    > 还需要在node_modules里面配置一下别名<img src="https://s2.loli.net/2022/05/19/Skzmf6DLa3UYHht.png" alt="2022-05-15-别名" style="zoom:67%;" />
    >
    > 
- news-api：后端
    ```
    npm i
    node app.js
    ```
- mydb：数据库
    ![mysql](https://s2.loli.net/2022/05/19/Z5nS2AKjkqY1ORi.png)
> 系统的超级管理员账号：admin；密码：123456
# 二 文件结构

## 前端结构

- components：组件
- request：各个模块的请求
- router：路由
- tstore：状态管理
- view：视图

## 后端结构

- router：路由挂载
- router-handler：路由处理函数
- schema：请求体验证规则
- uploads：图片上传
- utils：一些杂乱的封装
- db：mysql模块

# 三 前端要点记录

## 3.1 实现富文本

```bash
npm i react-rte
```
> https://github.com/sstur/react-rte
1. 通过`RichTextEditor.createEmptyValue()`初始化空对象
2. 如果初始化有内容（html格式），通过`RichTextEditor.createValueFromString(props.content, 'html')`进行重新赋值
3. 一旦失去焦点`onBlur`，调用父组件属性函数`done`并把对象转为html格式传给父组件
```jsx
// src/view/newsManage/EditBox.js
import React,{useState,useEffect} from 'react'
import RichTextEditor from 'react-rte';
export default function EditBox(props) {
    const [editorState, setEditorState] = useState(RichTextEditor.createEmptyValue());
    useEffect(() => {
        if(props.content!==""){
            setEditorState(RichTextEditor.createValueFromString(props.content, 'html'))
        }else{
            setEditorState(RichTextEditor.createEmptyValue())
        }
    }, [props.content]);
    return (
        <div>
            <RichTextEditor
                value={editorState}
                placeholder="请输入内容..."
                onChange={(editorState)=>{setEditorState(editorState)}}
                onBlur={()=>{props.done(editorState.toString('html'))}}
            />
        </div>
    )
}
```
```jsx
<EditBox done={(values)=>{setContent(values)}} content={content}/>
```
## 3.2 动态路由

1. 通过（冒号+参数）的形式表明为动态路由
```jsx
<Route path="news-manage/preview/:id" ...></Route>
```
2. 实现跳转
```jsx
<a href={`#/news-manage/preview/${id}`}>{text}</a>
const navigate = useNavigate()
navigate(`/news-manage/preview/${id}`)
```
## 3.3 axios封装

```js
// src/request/index.js

import { message} from 'antd';
import axios from 'axios'
import Qs from 'qs'
import AdminStore from '@/tstore/adminStore'  //mobx

const $axios = axios.create({
    baseURL: process.env.REACT_APP_URL,
    timeout: 1000,
});

//请求拦截器
$axios.interceptors.request.use((config)=> {
    config.headers.Authorization='Bearer ' + localStorage.getItem('token') //每个请求带上token
    return config
  }, function (error) {
    return Promise.reject(error);
});

//响应拦截器
$axios.interceptors.response.use((res)=> {
    if(res.data.status===200&&res.data.msg!=='ok'){
        message.success(res.data.msg)
    }else if(res.data.status!==200){  
        if(res.data.msg==='身份认证失败！'){
            window.location.href='/#/login'
        }else{
            message.error(res.data.msg)
        }
    }
    return res;
  }, function (error) {
    message.error(error);
    return Promise.reject(error);   
});

export default {
    post(url,data){
        return $axios({
            method:'post',
            url,
            data:Qs.stringify(data),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            }
        })
    },
    get(url,params){
        return $axios({
            method:'get',
            url,
            params
        })
    }
}
```
1. 为每个模块写好请求

```js
// src/request/news.js

import $axios from './index';

// 新闻类别
export async function getNewsSort(){
    return $axios.get('/api/getnewssort')
}
// 草稿箱列表
export async function getDraftList(params){
    return $axios.get('/api/getDraftList',params)
}

// 新建草稿
export async function createNews(data){
    return $axios.post('/api/createnews',data)
}
```
2. 导入到对应页面使用
```js
import {getNewsSort,getDraftList,createNews} from '@/request/news'
```

## 3.4 mobx状态管理

```bash
npm i mobx mobx-react
```

---

### 1.持久化

下面是登陆的时候保存用户token，用户信息，用户可操作性模块和权限的。localstorage不允许存储对象数组类型，需要通过`JSON.stringify`先转化为JSON字符后再保存，当localstorage有对应数据是，再通过`JSON.parse`存储到mobx中

```js
// \src\tstore\adminStore.js
import { observable,configure, runInAction } from "mobx"
import {getModulesAndRolesById,getUserInfo,loginRequest } from '@/request/admin'

const AdminStore=observable({
    modules:localStorage.getItem('modules')?JSON.parse(localStorage.getItem('modules')):[],
    userInfo:localStorage.getItem('userinfo')?JSON.parse(localStorage.getItem('userinfo')):'',
    token:localStorage.getItem('token')?localStorage.getItem('token'):'',

    // 登陆时调用这个
    async requireLogin(value){
        // 01 获取token
        const res=await loginRequest(value)
        if(res.data.status===200){
            localStorage.setItem('token',res.data.token)
            this.token=res.data.token
        }  

        // 02 获取用户信息
        await this.requireUserInfo()
        // 03 获取可操作模块和权限
        // 因为登陆和管理模块中都需要调用这个方法，而登陆需要调整，管理模块不需要，故加上一个参数用于区分
        await this.requireModules('login') 
    }

    // 这里保存了两份，目的是1.用户重新进来的时候可以直接通过localstorage的数据进行模块渲染；2.在其他需要数据的地方直接通过mobx获取数据而不用转换为对象
    async requireModules(type){
        const res=await getModulesAndRolesById()
        if(res.data.status===200){
            localStorage.setItem('modules',JSON.stringify(res.data.data)) 
            runInAction(()=>{
                this.modules=res.data.data
                if(type==='login'){
                    window.location.href = '/#/home'
                }
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
})
export default AdminStore
```
调用
```js
import AdminStore from '@/tstore/adminStore'
AdminStore.requireLogin(value) 
```
### 2. 响应式

> https://mobx-react.js.org/observer-component

本项目的组件都是函数式组件。下面以展开和收起菜单为演示：

1.定义可观察对象
```js
// \src\tstore\adminStore.js
import { observable } from "mobx"
const AdminStore=observable({
    collapse:false,
    setCollapse(){
        this.collapse=!this.collapse
    }
})
export default AdminStore
```
2.导入可观察对象
```jsx
// src\components\TopHeader.js

import AdminStore from '@/tstore/adminStore'
```
3.通过observer将组件变为可观察,即用`observer()`包裹函数式组件
```jsx
// src\components\TopHeader.js

import { observer } from 'mobx-react';
export default observer(()=>{
    //...

    return(
        //...
    )
})
```
4.使用可观察对象提供的属性和方法
```jsx
<span 
    style={{float:'left',cursor:'pointer',fontSize:'20px'}} 
    onClick={()=>{AdminStore.setCollapse()}}>
    {
        AdminStore.collapse?<MenuUnfoldOutlined/>:<MenuFoldOutlined/>
    }
</span>
```
---
另外也有钩子写法，如果状态结构不是很复杂，单个页面不需要使用多个模块的状态，可以不用。但是写法比较有趣，还是去用了下。

1. 给可观察对象创建上下文环境
```js
// \src\tstore\contexts.js

import React from 'react'
import UserStore from './userStore'
import AdminStore from './adminStore'
import PowerStore from './powerStore' 

export const storesContext = React.createContext({
    UserStore,
    AdminStore,
    PowerStore
})
```
2. 使用上下文环境
```js
// src\tstore\useStores.js
import React from 'react'
import { storesContext } from './contexts' //导入上下文环境

export const useStores = () => React.useContext(storesContext)
```
3. 在页面中使用
```js
import { observer } from 'mobx-react';
import { useStores } from '@/tstore/useStores'
export default observer(()=>{
    const {UserStore,PowerStore}=useStores()  //想要哪个模块的数据就解构哪个

    return(
        //...
    )
})
```
# 四后端要点记录

## 4.1 mysql的query

一开始写的时候觉得没什么，后面越写嵌套越深，深感不对劲，特别是在处理事务的时候，非常难搞，于是去封装了一下
```js
// util/query.js
const db=require('../db')

/*
    @params {string} sql 语句 （*）
    @params {string|object} values 给sql语句的?占位符传值
    @params {function} response 中间件的res，传进来是为了方便自己在这里处理错误
    -----------------------
    示例：
    const rows=await query('select * from user',res)
    await query('update user set ? where id=1',req.body,res)
*/
function query(sql,values,response){
    let res=response
    if(response===undefined){
        res=values //如果只传了两个参数，那么第二个参数values其实是res
    }
    return new Promise((resolve,reject)=>{
        db.query(sql,values,(err,rows)=>{
            if (err){res.err(err);reject(err)}
            resolve(rows)
        })
    })
}



// 与前者的区别在于：这个是用于事务时方法，当遇到错误时会回滚
function queryT(sql,values,response){
    let res=response
    if(response===undefined){
        res=values
    }
    return new Promise((resolve,reject)=>{
        db.query(sql,values,(err,rows)=>{
            if (err){db.rollback(()=>{res.err(err)});reject(err)}
            resolve(rows)
        })
    })
}
```

## 4.2 分页处理

如果业务只有一个需要进行分页和查询，那么没必要封装。其实一直在想能不能只通过一条语句同时获取总条数和当前页的数据，但没想出来。
```js
// util/sqlhandler.js
/*
    使用：sqlhandler(head,query,order,currentPageKey,pageSizeKey)
    作用：分页查询，可添加分页。该方法可以过滤出分页字段，重置条件，拼接sql语句
    @params {STRING} head sql前半部分 （*）
    @params {OBJECT} query 查询条件 （*）
    @params {STRING} order 排序方式，需要按照mysql的语法写 （*）
    @params {STRING} currentPageKey 指定当前页的字段名，默认为currentPage
    @params {STRING} pageSizeKey 指定页面大小的字段名，默认为pageSize
    ----------------------------------------------------------------------------
    示例： 
        const head="SELECT * FROM userlist_view"
        db.query(sqlConcat(head,req.query),(err,results)=>{...}
*/
exports.sqlConcat=(head,query,order='',currentPageKey='currentPage',pageSizeKey='pageSize')=>{
    let arr=[] // 条件
    for(key in query){
        // 剔除不进行条件查询的：为空、等于0、等于‘当前页’的字段名称、等于‘页面大小’的字段名称
        // 例如，如果前端传来了currentPage和pageSize字段，那么会将其排除，不让它们作为查询条件
        if(query[key]!==''&&query[key]!=0&&key!==currentPageKey&&key!==pageSizeKey){
            //特殊处理特殊条件（处理有限...）
            let pattern=/<>|>=|<=|>|</g
            if(typeof query[key]==='string'){
                if(query[key].match(pattern)){
                    let matchstr=query[key].match(pattern)[0]
                    arr.push(`\`${key}\`${matchstr}\"${query[key].slice(matchstr.length)}\"`)
                    continue
                }
            }
            //其他等值条件
            arr.push(`\`${key}\`=\"${query[key]}\"`)
        }
    }
    // 4.获取当前页和页大小的值
    let pageSize=Number(query[pageSizeKey])
    let currentPage=Number(query[currentPageKey])
    // 5. 拼接
    if(order==='')return `${head} ${arr.length>0?'where '+arr.join(" and "):''} limit ${pageSize} offset ${pageSize*(currentPage-1)}`
    if(order!=='')return `${head} ${arr.length>0?'where '+arr.join(" and "):''} order by ${order} limit ${pageSize} offset ${pageSize*(currentPage-1)}`
}


/*
    使用：sqlCount(head,query,currentPageKey,pageSizeKey)
    作用：和上面没什么区别，对应于前者，主要是根据条件获取总条数
    @params {STRING} table 查询的表名称 （*）
    @params {OBJECT} query 查询字符给where传的对象 （*）
    @params {STRING} currentPageKey 指定当前页的字段名，默认为currentPage
    @params {STRING} pageSizeKey 指定页面大小的字段名，默认为pageSize
    ------------------------------------------------------------------------
    示例： 
     db.query(sqlCount('userlist_view',req.query),(err,result)=>{
         const total=result[0].total
     }
*/
exports.sqlCount=(table,query,currentPageKey='currentPage',pageSizeKey='pageSize')=>{
    let arr=[]
    for(key in query){
        if(query[key]!==''&&query[key]!=0&&key!==currentPageKey&&key!==pageSizeKey){
            let pattern=/<>|>=|<=|>|</g
            if(typeof query[key]==='string'){
                if(query[key].match(pattern)){
                    let matchstr=query[key].match(pattern)[0]
                    arr.push(`\`${key}\`${matchstr}\"${query[key].slice(matchstr.length)}\"`)
                    continue
                }
            }
            arr.push(`\`${key}\`=\"${query[key]}\"`)
        }
    }
    return `select count('id') as total from ${table} ${arr.length>0?'where '+arr.join(" and "):''}`
}
```
## 4.3 一对多批量插入

有一个业务是给角色添加多可模块，如果单纯的用拼接用些困难，于是封装了以下。如果有其他处理方法还请评论！
```js
// util/sqlhandler.js
/*
    说明：场景受限，通常用在中间表
    @params {STRING} tableName 表格名称 （*）
    @params {STRING} parentKey 父级key，即“一”的key （*）
    @params {STRING} childrenKey 孩子key，即“多”的key （*）
    @params {STRING} parentValue 父级的value，单个字符串 （*）
    @params {STRING} childrenValuesStr 孩子value，用逗号隔开值 （*）
    -----------------------
    示例：
    const SQL=OneToManyInsert('character_modules','character_id','module_id','1','2,3,5,6')
    （效果等同于：insert into character_modules('character_id','module_id') values(1,2),(1,3),(1,5),(1,6)）
*/
exports.OneToManyInsert=(tableName,parentKey,childrenKey,parentValue,childrenValuesStr)=>{
    let base=`insert into ${tableName} (\`${parentKey}\`,\`${childrenKey}\`) values` 
    let valueArr=[]
    childrenValuesStr.split(",").forEach(value=>{
        valueArr.push(`(${parentValue},${value})`)
    })
    return base+valueArr.join(",")
}
```
## 4.4 生成树

1. 传入双数组生成父子树

场景：分别有模块表和权限表（打平），而权限是对应于又对应于一个模块，所以想通过它们的对应关系，把权限插入到对应模块中

```js
/*
    作用：传入两个数组，根据key生成父子关系
    @params {TYPE} parentArr 父级数组 （*）
    @params {TYPE} parent_key 父级节点中，连接孩子结点所依据的key，可以理解为自身的标识 （*）
    @params {TYPE} childrenArr 孩子数组 （*）
    @params {TYPE} child_key 孩子节点中，连接父级结点所依据的key （*）
    @params {TYPE} children_key 父级结点中保存所有孩子结点的key
    -----------------------
    示例：
    childrenInsertParent(moduleArr,'id',roleArr,'module_id','roles')
    （解释：moduleArr是父数组，id是父元素的自身的标识；roleArr是子数组，子元素通过module_id指向父元素；当父元素有孩子，将其放进roles中）
    
*/
exports.childrenInsertParent=(parentArr,parent_key,childrenArr,child_key,children_key="children")=>{
    parentArr.forEach(parent=>{
        let children=childrenArr.filter(child=>child[child_key]===parent[parent_key])
        if(children.length!==0){
            parent[children_key]=children
        }
    })
    return parentArr
}
```

2. 传入单数组生成父子树
```js
/*
    作用：传入打平的数组生成二级树
    @params {Array} Nodes 打平的数组 （*）
    @params {String} selfKey 结点自身的标识 （*）
    @params {String} parentKey 结点指向父节点的key （*）
    @params {String} parentTopValue 如果是顶级，它的parentKey的值 （*）
    -----------------------
    示例：
    NodesToTree(moduleArr,'module_id','parent_id','0')
    (解释：每个元素都有module_id和parent_id；当parent_id=0时，表示为父元素；当parent_id不为0时，它的值是什么，对应的module_id就是它的双亲)
*/
exports.NodesToTree=(Nodes,selfKey,parentKey,parentTopValue)=>{
    let parentArr=Nodes.filter(node=>node[parentKey]===parentTopValue) //过滤出顶级父级
    Nodes=Nodes.filter(node=>node[parentKey]!==parentTopValue) //重置Nodes
    parentArr.forEach(parent=>{
        let childrenArr=Nodes.filter(node=>node[parentKey]===parent[selfKey]) //如果孩子的parentkey等于父节点自身的id
        if(childrenArr.length!==0){
            parent.children=childrenArr //二级树完成
        }
    })
    return parentArr
}
```
## 4.5 过滤出新增与删除的部分

```js
/*
    作用：输入旧的和新的字符，处理出在旧数据的基础上删除的部分和新增的部分
    @params {STRING} oldStr 老的数据，用逗号相隔 （*）
    @params {STRING} newStr 新的数据，用逗号相隔 （*）
    -----------------------
    示例：
    let result=splitAddAndDelete('1,2,4,5','1,6,7,8,9')
*/
exports.splitAddAndDelete=(oldStr,newStr)=>{
    let oldArr=oldStr.split(",")
    let newArr=newStr.split(",")
    
    // 交集
    const intersecttion=newArr.filter(item=>{
        return oldArr.includes(item)
    })
    // 删除的
    const deleteArr=oldArr.filter(olditem=>{
        return !intersecttion.includes(olditem)
    })
    
    // 新增的
    const addArr=newArr.filter(newitem=>{
        return !intersecttion.includes(newitem)
    })
    
   return{
    deleteStr:deleteArr.join(","),
    addStr:addArr.join(",")
   }
}
```
> 后端的其他部分说明可参见我这两篇文章：https://www.cnblogs.com/sanhuamao/p/16244467.html、https://www.cnblogs.com/sanhuamao/p/16227089.html






## 其他乱七八糟

![图 1](images/2022-05-17-%E8%87%AA%E5%AE%9A%E4%B9%89%E9%92%A9%E5%AD%90.png)  
![图 4](images/2022-05-17-%E5%87%BD%E6%95%B0.png)  
![图 5](images/2022-05-17-%E4%BC%A0%E5%80%BC.png)  
![图 7](images/2022-05-17-dd.png)  

