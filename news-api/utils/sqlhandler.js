/*
    使用：sqlhandler(head,query,currentPageKey,pageSizeKey,BOOLEAN)
    作用：根据条件分页查询数据
    @params {STRING} head 查询字符前半部分 （*）
    @params {OBJECT} query 查询字符给where传的对象 （*）
    @params {STRING} order 排序方式，需要按照mysql的语法写 （*）
    @params {STRING} currentPageKey 指定当前页的字段名，默认为currentPage
    @params {STRING} pageSizeKey 指定页面大小的字段名，默认为pageSize
    ----------------------------------------------------------------------------
    示例： 
        const head="SELECT * FROM userlist_view"
        //使用默认字段+精准查询
        db.query(sqlConcat(head,req.query),(err,results)=>{...}
*/
exports.sqlConcat=(head,query,order='',currentPageKey='currentPage',pageSizeKey='pageSize')=>{
    // 1.加入条件字段
    let arr=[]
    for(key in query){
        //剔除不进行条件查询的：为空、等于0、等于当前页的字段名、等于页面大小的字段
        if(query[key]!==''&&query[key]!=0&&key!==currentPageKey&&key!==pageSizeKey){
            //特殊处理特殊条件
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
    // 4.获取当前页和页大小的值
    let pageSize=Number(query[pageSizeKey])
    let currentPage=Number(query[currentPageKey])
    // 5. 拼接
    if(order==='')return `${head} ${arr.length>0?'where '+arr.join(" and "):''} limit ${pageSize} offset ${pageSize*(currentPage-1)}`
    if(order!=='')return `${head} ${arr.length>0?'where '+arr.join(" and "):''} order by ${order} limit ${pageSize} offset ${pageSize*(currentPage-1)}`
}


/*
    使用：sqlCount(head,query,currentPageKey,pageSizeKey,BOOLEAN)
    作用：根据条件获取总数据条数
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
        //剔除不进行条件查询的
        if(query[key]!==''&&query[key]!=0&&key!==currentPageKey&&key!==pageSizeKey){
            //特殊处理特殊条件
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

/*
    作用：批量插入数据
    @params {STRING} tableName 表格名称 （*）
    @params {STRING} parentKey 父级key （*）
    @params {STRING} childrenKey 孩子key （*）
    @params {STRING} parentValue 父级的value （*）
    @params {STRING} childrenValuesStr 孩子值的字符串 （*）
    -----------------------
    示例：const SQL=OneToManyInsert('character_modules','character_id','module_id','1','2,3,5,6')
*/
exports.OneToManyInsert=(tableName,parentKey,childrenKey,parentValue,childrenValuesStr)=>{
    let base=`insert into ${tableName} (\`${parentKey}\`,\`${childrenKey}\`) values` 
    let valueArr=[]
    childrenValuesStr.split(",").forEach(value=>{
        valueArr.push(`(${parentValue},${value})`)
    })
    return base+valueArr.join(",")
}


