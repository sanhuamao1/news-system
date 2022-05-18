


/*
    作用：传入两个数组，根据key生成父子关系
    @params {TYPE} parentArr 父级数组 （*）
    @params {TYPE} parent_key 父级节点连接孩子结点所依据的key （*）
    @params {TYPE} childrenArr 孩子数组 （*）
    @params {TYPE} child_key 孩子节点连接父级结点所依据的key （*）
    @params {TYPE} children_key 父级结点中保存所有孩子结点的key
    -----------------------
    实例：childrenInsertParent(moduleArr,'id',roleArr,'module_id','roles')
    
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

/*
    作用：传入打平的数组生成二级树
    @params {Array} Nodes 打平的数组 （*）
    @params {String} selfKey 结点自身的key （*）
    @params {String} parentKey 指向父节点的key （*）
    @params {String} parentTopValue 作为顶级结点的值 （*）
    -----------------------
    示例：NodesToTree(moduleArr,'module_id','parent_id','0')
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

// 过滤出有权限的模块
exports.filterModuleHasRoles=(modules,roles)=>{
    let arr=[]
    modules.forEach(module=>{
        let filters=roles.filter(role=>role.module_id===module.module_id)
        if(filters.length!==0){
            arr.push({
                ...module,
                roles:filters
            })
        }
    })
    return arr
}

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