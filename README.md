# news-system
## 项目组成
- news-app：前端
    ```
    npm i
    npm start
    ```
    > 还需要在node_modules里面配置一下别名![图 10](images/2022-05-15-%E5%88%AB%E5%90%8D.png)  
- news-api：后端
    ```
    npm i
    node app.js
    ```
- mydb：数据库
    ![图 4](images/mysql.png)  

## 文件结构
### 前端
- components：组件
- request：各个模块的请求
- router：路由
- tstore：状态管理
- view：视图

### 后端
- router：路由挂载
- router-handler：路由处理函数
- schema：请求体验证规则
- uploads：图片上传
- utils：一些杂乱的封装
- db：mysql模块

## 后端部分
### 01 mysql的query封装

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
### 02 分页处理封装
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
### 03 一对多批量插入封装
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
## 04 生成树
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
### 05 过滤出新增与删除的部分
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



## 其他参考
- 富文本：https://github.com/sstur/react-rte
- mobx：https://mobx-react.js.org/observer-component

## 其他乱七八糟

![图 1](images/2022-05-17-%E8%87%AA%E5%AE%9A%E4%B9%89%E9%92%A9%E5%AD%90.png)  
![图 4](images/2022-05-17-%E5%87%BD%E6%95%B0.png)  
![图 5](images/2022-05-17-%E4%BC%A0%E5%80%BC.png)  
![图 7](images/2022-05-17-dd.png)  

