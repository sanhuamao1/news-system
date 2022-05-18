const db=require('../db')
const {NodesToTree,filterModuleHasRoles,splitAddAndDelete,childrenInsertParent}=require('../utils/structurehandler')
const {OneToManyInsert,sqlConcat,sqlCount}=require('../utils/sqlhandler')
const {query,queryT}=require('../utils/query')

// 获取角色列表
exports.getCharacters=async (req,res)=>{
    //获取总数
    const getCountSQL=sqlCount('characters',req.query)
    const totalRows=await query(getCountSQL,res)
    if(totalRows.length!==0){
        //获取数据
        const total=totalRows[0].total
        const head="SELECT id,name,description,state,`key` FROM characters"
        const searchSQL=sqlConcat(head,req.query)
        
        const characterRows=await query(searchSQL,res)
        res.ok('ok',{
            data:characterRows,
            total
        })
    }else{
        res.ok('ok',{
            data:[],
            total:0
        })
    }
}

// 停用角色
exports.stopCharacter=(req,res)=>{
    const id=req.query.id
    db.beginTransaction(async (err)=> {
        if (err) return res.err(err)
        await queryT(`update characters set state=0 where id=${id}`,res) //1.更新状态
        const userRows=await queryT(`select id from user where character_id=${id}`,res) //2.找到用户
        if(userRows.length!==0){
            await queryT(`update user set character_id=6 where id in(${userRows.map(item=>item.id).join(',')})`,res) //3.移除用户
        }
        db.commit((err)=>{
            if (err)  return db.rollback(res.err(err));
            res.ok('停用成功')
        });
    })
}

// 恢复角色
exports.aliveCharacter=async (req,res)=>{
    await query(`update characters set state=1 where id=${req.query.id}`,res)
    res.ok('恢复成功')
}

// 获取所有开启的模块
exports.getAllOpenModules=async (req,res)=>{
    const rows=await query('select `key`,`id` as module_id,`name`,parent_id from module where state=1',res)
    res.ok('ok',{
        data:NodesToTree(rows,'module_id','parent_id',0)
    })
}

// 过滤包含权限的模块
exports.getRolesByModule=async(req,res)=>{
    let moduleStr=req.query.moduleStr
    if(moduleStr==='')return res.err('至少选择一个模块')
    //1.获取模块
    const mosuleSQL="select id as module_id,`name` as module_name from module where id in("+moduleStr+")"
    const Modules=await query(mosuleSQL,res)
    //2.获取属于模块的权限
    const roleSQL="select id as role_id,`name` as role_name,module_id from roles where module_id in("+moduleStr+")"
    const Roles=await query(roleSQL,res)
    res.ok('ok',{
        data:filterModuleHasRoles(Modules,Roles)
    })
}

// 添加角色-判断角色是否存在
exports.isNewCharaterExist=async (req,res)=>{
    let SQL=`select id from characters where \`name\`='${req.query.name}' or \`key\`='${req.query.key}'`
    const rows=await query(SQL,res)
    if(rows.length!==0)return res.err('角色名称已存在！')
    res.ok()
}

exports.addCharacter=(req,res)=>{
    //base:基本信息对象；modules：模块字符串；roles：权限字符串
    const input=JSON.parse(req.body.data)
    db.beginTransaction(async (err)=> {
        if (err) return res.err(err)
        // 1.插入到角色表
        await queryT("insert into characters set ?",input.base,res)
        // 2.找到新角色的id
        const Query_SelectId=await queryT("select `id` from characters where `name`=?",input.base.name,res)
        let newid=Query_SelectId[0].id
        // 3.在角色模块中间表中插入新模块
        const moduleInsertSQL=OneToManyInsert('character_modules','character_id','module_id',newid,input.modules) 
        await queryT(moduleInsertSQL,res)
        // 4.在角色权限中间表中插入新权限（如果有）
        if(input.roles!==''){
            const roleInsertSQL=OneToManyInsert('character_roles','character_id','role_id',newid,input.roles)
            await queryT(roleInsertSQL,res)
        }
        db.commit((err)=>{
            if (err)  return db.rollback(function() {throw err});
            res.ok('新建成功')
        });
    });
}

// 编辑角色-判断角色是否存在
exports.isCharaterExist=async(req,res)=>{
    const oldrow=await query("select name,`key` from characters where id=?",req.query.id,res)
    const SQL=`select id from characters where (\`name\`='${req.query.name}' and \`name\`!='${oldrow[0].name}') or (\`key\`='${req.query.key}' and \`key\`!='${oldrow[0].key}')`
    
    const rows=await query(SQL,res)
    if(rows.length!==0)return res.err('角色名称已存在！')
    res.ok()
}

// 编辑角色
exports.updateCharacter=(req,res)=>{
    //base:基本信息对象,包括id;
    //modules;新传进来的模块
    //roles;新传进来的权限
    const input=JSON.parse(req.body.data)
    const id=input.base.id
    db.beginTransaction(async (err)=>{
        if (err) return res.err(err)
        // 1.更新基本信息
       await queryT(`update characters set ? where id=${id}`,input.base,res)
        // 2.获取老模块
        const oldModules=await queryT("select module_id from character_modules where character_id=?",id,res)
        const moduleids_str=oldModules.map(item=>item.module_id).join(",")//老的模块字符串
        const moduleSpliter=splitAddAndDelete(moduleids_str,input.modules)//分离处理
        const addModulesStr=moduleSpliter.addStr
        const deleteModulesStr=moduleSpliter.deleteStr
        // 3.获取老权限
        const OldRoles=await queryT("select role_id from character_roles where character_id=?",id,res)
        const roleids_str=OldRoles.map(item=>item.role_id).join(",")//老的权限字符串
        const roleSpliter=splitAddAndDelete(roleids_str,input.roles)//分离处理
        const addRolesStr=roleSpliter.addStr
        const deleteRolesStr=roleSpliter.deleteStr
        // 4.删除与增加模块
        if(deleteModulesStr!==''){
            const DeleteModuleSQL=`delete from character_modules where module_id in(${deleteModulesStr}) and character_id=${id}`
            await query(DeleteModuleSQL,res)
        }
        if(addModulesStr!==''){
            const AddModulesSQL=OneToManyInsert('character_modules','character_id','module_id',id,addModulesStr)
            await query(AddModulesSQL,res)
        }
        // 5.删除与增加权限
        if(deleteRolesStr!==''){
            const DeleteRoleSQL=`delete from character_roles where role_id in(${deleteRolesStr}) and character_id=${id}`
            await query(DeleteRoleSQL,res)
        }
        if(addRolesStr!==''){
            const addRoleSQL=OneToManyInsert('character_roles','character_id','role_id',id,addRolesStr)
            await query(addRoleSQL,res)
        }
        db.commit((err)=>{
            if (err)  return db.rollback(function() {throw err});
            res.ok('修改成功')
        });
    })
}


// character_modules_state_view：角色模块中间表，过滤出模块为开启状态的数据
// 根据角色id获取模块id和权限id
exports.getModuleidAndRoleidByid=async (req,res)=>{
    const id=req.query.character_id
    // 1.根据角色id获取模块
    const getModuleidsSQL="select module_id from character_modules_state_view where character_id=?"
    const moduleArr=await query(getModuleidsSQL,id,res)
    // 2.根据角色id获取权限
    const getRoleidsSQL="select role_id from character_roles where character_id=?"
    const roleArr=await query(getRoleidsSQL,id,res)
    res.ok('ok',{
        moduleArr:moduleArr.map(item=>item.module_id),
        roleArr:roleArr.map(item=>item.role_id)
    })
}

// 删除角色
exports.deleteCharacter=(req,res)=>{
    const id=req.query.id
    db.beginTransaction(async (err)=>{
        // 1.从角色模块中间表删除
        const DeletefromTableWidthModuleSQL=`delete from character_modules where character_id=${id}`
        await query(DeletefromTableWidthModuleSQL,res)
        // 2.从角色权限中间表删除
        const DeletefromTableWidthRoleSQL=`delete from character_roles where character_id=${id}`
        await query(DeletefromTableWidthRoleSQL,res)
        // 3.从角色表删除角色
        const DeletefromCharactersSQL=`delete from characters where id=${id}`
        await query(DeletefromCharactersSQL,res)
        // 4.移除属于该角色的用户
        const GetUersRows=await queryT(`select id from user where character_id=${id}`,res)
        if(GetUersRows.length!==0){
           await queryT(`update user set character_id=6 where id in(${GetUersRows.map(item=>item.id).join(',')})`,res)
        }
        db.commit((err)=>{
            if (err)  return db.rollback(function() {throw err});
            res.ok('删除成功')
        });
    })
}

// 权限列表：获取所有模块和权限
exports.getAllModulesAndRoles=async (req,res)=>{
    //1.获取模块列表
    const getModuleSQL="select * from module"
    const moduleRows=await query(getModuleSQL,res)
    //2.获取权限列表
    const getRoleSQL="select *from roles"
    const roleRows=await query(getRoleSQL,res)
    //3.插入对应权限
    const moduleWithRoles=childrenInsertParent(moduleRows,'id',roleRows,'module_id','roles')
    //4.生成树并返回
    res.ok('ok',{
        data:NodesToTree(moduleWithRoles,'id','parent_id',0)
    })
}

// 权限列表：停用模块
exports.stopModule=(req,res)=>{
    const SQL=`update module set state=0 where id=${req.query.id}`
    db.query(SQL,(err,data)=>{
        if(err) return res.err(err)
        res.ok('停用成功')
    })
}

// 权限列表：恢复模块
exports.aliveModule=(req,res)=>{
    const SQL=`update module set state=1 where id=${req.query.id}`
    db.query(SQL,(err,data)=>{
        if(err) return res.err(err)
        res.ok('恢复成功')
    })
}