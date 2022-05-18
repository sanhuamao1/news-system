
const moment=require('moment')
const {query,queryT}=require('../utils/query')
const {sqlCount,sqlConcat}=require('../utils/sqlhandler')
const db=require('../db')

// 获取新闻类别
exports.getNewsSort=async (req,res)=>{
    const data=await query(`select id,name from news_sorts order by id`,res)
    res.ok('ok',{
        data
    })
}

const getNewid=async(table,res)=>{
    const SQL=`select max(id) as id from ${table}`
    const idrows=await queryT(SQL,res)
    return idrows[0].id
}

// 更新新闻详情表的最新审核id
const handleUpdateNewLatestCheck=async (news_id,res)=>{
    // 1.插入审核记录
    const checkInfo={
        news_id,
        submit_time:moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
    }
    await queryT(`insert news_checks set ?`,checkInfo,res)
    // 2.获取审核表最新的id
    const checkidRows=await queryT(`select max(id) as id from news_checks`,res)
    const check_id=checkidRows[0].id
    // 3.在新闻详情表更新最新的latest_check_id
    await queryT(`update news_detail set latest_check_id=${check_id} where id=${news_id}`)
    return 'ok'
}

// 创建新闻
exports.createNews=(req,res)=>{
    db.beginTransaction(async (err)=> {
        const newsinfo={
            ...req.body,//含有check_state
            author_name:req.auth.username,
        }
        await queryT(`insert into news_detail set ?`,newsinfo,res)

         //如果是提交审核，多加一步
        if(newsinfo.check_state===2){
            const news_id=await getNewid('news_detail',res)
            await handleUpdateNewLatestCheck(news_id,res)
        }
        db.commit((err)=>{
            if (err)  return db.rollback(res.err(err));
            res.ok('创建成功')
        });
    })
}

// 更新草稿
exports.updateDraft=(req,res)=>{
    db.beginTransaction(async (err)=> {
        await queryT(`update news_detail set ? where id=${req.body.id}`,{...req.body,check_state:2},res)
         //如果是提交审核2 、未通过4
        if(req.body.check_state!==1){
            await handleUpdateNewLatestCheck(req.body.id,res)
        }
        db.commit((err)=>{
            if (err)  return db.rollback(res.err(err));
            res.ok('更新成功')
        });
    })
}

// 提交审核(单纯提交 没有修改内容)
exports.submitDraft=async(req,res)=>{
    db.beginTransaction(async (err)=> {
        // 1.先更新草稿状态
        await queryT(`update news_detail set check_state=2 where id=${req.query.id}`,res)

        // 2. 更新最新审核id
        await handleUpdateNewLatestCheck(req.query.id,res)
        db.commit((err)=>{
            if (err)  return db.rollback(res.err(err));
            res.ok('成功提交')
        });
    })
    
}


// 获取草稿列表
exports.getDraftList=async(req,res)=>{
    const params={
        ...req.query,
        author_name:req.auth.username
    }
    const getCountSQL=sqlCount('news_draflist_view',params)
    const totalRows=await query(getCountSQL,res)

    if(totalRows.length!==0){
        const total=totalRows[0].total
        const head="select * from news_draflist_view"
        const searchSQL=sqlConcat(head,params,'update_time desc')
        const draftRows=await query(searchSQL,res)
        res.ok('ok',{
            data:draftRows,
            total
        })
    }else{
        res.ok('ok',{
            data:[],
            total:0
        })
    }
}


// 删除草稿/新闻 传id,check_state
exports.deleteDraft=(req,res)=>{
    db.beginTransaction(async (err)=> {
        await queryT(`delete from news_checks where news_id=${req.query.id}`,res)
        await queryT(`delete from news_comments where news_id=${req.query.id}`,res)
        await queryT(`delete from news_detail where id=${req.query.id}`,res)
        db.commit((err)=>{
            if (err)  return db.rollback(res.err(err));
            res.ok('删除成功')
        });
    })
}


// 获取新闻详情
exports.getNewsDetail=async(req,res)=>{
    const rows=await query(`select id,title,content,create_time,sort_id,check_state,publish_state,star,view,comment,author_name from news_detail where id=${req.query.id}`,res)
    res.ok('ok',{
        data:rows[0]
    })
}


// 获取审核列表--用户版
exports.getCheckList=async(req,res)=>{
    const params={
        ...req.query,
        author_name:req.auth.username
    }
    const getCountSQL=sqlCount('news_checklist_view',params)
    const totalRows=await query(getCountSQL,res)

    if(totalRows.length!==0){
        const total=totalRows[0].total
        const head="select * from news_checklist_view"
        const searchSQL=sqlConcat(head,params,'check_state asc,check_time desc')
        const draftRows=await query(searchSQL,res)
        res.ok('ok',{
            data:draftRows,
            total
        })
    }else{
        res.ok('ok',{
            data:[],
            total:0
        })
    }
}


// 撤销审核
exports.drawbackCheck=async(req,res)=>{
    db.beginTransaction(async (err)=> {
        // 1.找到所有的审核记录
        const checkRows=await queryT(`select id from news_checks where news_id=${req.query.id} order by submit_time`)
        console.log('checkRows',checkRows)
        // 2.修改latestcheckid和审核状态：如果只有一条审核记录，那么撤销后置为空；如果有多条审核记录，那么撤销后赋值上一条
        const info={
            latest_check_id:checkRows.length==1?null:checkRows[1].id,
            check_state:1,
            update_time:moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
        }
        await queryT(`update news_detail set ? where id=${req.query.id}`,info,res)

        // 3.删除审核记录
        await queryT(`delete from news_checks where id=${checkRows[0].id}`,res)
        db.commit((err)=>{
            if (err)  return db.rollback(res.err(err));
            res.ok('成功撤销')
        });
    })
}


// 获取审核列表--管理员版
exports.getCheckListForManager=async(req,res)=>{
    const getCountSQL=sqlCount('news_checklist_view',req.query)
    const totalRows=await query(getCountSQL,res)
    if(totalRows.length!==0){
        const total=totalRows[0].total
        const head="select id,title,latest_check_id,submit_time,author_name,sort_id from news_checklist_view where check_state=2"
        const searchSQL=sqlConcat(head,req.query,'submit_time asc')
        const checkRows=await query(searchSQL,res)
        res.ok('ok',{
            data:checkRows,
            total
        })
    }else{
        res.ok('ok',{
            data:[],
            total:0
        })
    }
}

// 审核通过
exports.agreeCheck=(req,res)=>{
    db.beginTransaction(async (err)=> {
        // 1.设置新闻详情表的check_state--3
        await queryT(`update news_detail set check_state=3,publish_state=2 where id=${req.body.id}`,res)
        // 2.更新审核记录
        const info={
            check_time:moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
            check_person:req.auth.username,
            check_comment:req.body.check_comment,
            check_result:1
        }
        await queryT(`update news_checks set ? where id=${req.body.latest_check_id}`,info,res)
        db.commit((err)=>{
            if (err)  return db.rollback(res.err(err));
            res.ok('已反馈')
        });
    })
}

// 审核不通过
exports.opposeCheck=async(req,res)=>{
    db.beginTransaction(async (err)=> {
        await queryT(`update news_detail set check_state=4 where id=${req.body.id}`,res)
        // 2.更新审核记录
        const info={
            check_time:moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
            check_person:req.auth.username,
            check_comment:req.body.check_comment,
            check_result:2
        }
        await queryT(`update news_checks set ? where id=${req.body.latest_check_id}`,info,res)
        db.commit((err)=>{
            if (err)  return db.rollback(res.err(err));
            res.ok('已反馈')
        });
    })
}

// 发布列表
exports.getPublishList=async(req,res)=>{
    const data =await query(`select id,title,sort_id,author_name,check_time,check_person,publish_state from news_checklist_view where publish_state=${req.query.publishState}`)
    res.ok('ok',{
        data
    })
}

// 发布新闻 
exports.publishNews=async(req,res)=>{
    await queryT(`update news_detail set publish_state=3 where id=${req.query.id}`,res)
    res.ok('发布成功')
}

// 下线新闻 
exports.offlineNews=async(req,res)=>{
    await queryT(`update news_detail set publish_state=4 where id=${req.query.id}`,res)
    res.ok('下线成功')
}

// 获取审核记录：传入新闻id
exports.getCheckHistory=async(req,res)=>{
    const data=await query(`select id,check_time,check_person,check_comment,check_result,submit_time from news_checks where news_id=${req.query.id}`)
    res.ok('ok',{
        data
    })
}