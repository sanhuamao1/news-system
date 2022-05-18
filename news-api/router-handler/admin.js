const db=require('../db')
const jwt=require('jsonwebtoken')
const config = require('../config')
const {NodesToTree}=require('../utils/structurehandler')

// 注册
exports.register=(req,res)=>{
    const isExistSQL='select * from user where username=?'
    db.query(isExistSQL,req.body.username,(err,results)=>{
        if(err)return res.err(err)
        if(results.length===1) return res.err('用户已存在！')
        const AddUserSQL="insert into user set ?"
        db.query(AddUserSQL,req.body,(err,results)=>{
            if(err)return res.err(err)
            if(results.affectedRows!==1) return res.err('注册失败')
            res.ok('注册成功')
        })
    })
}

// 登陆
exports.login=(req,res)=>{
    const getInfoByNameSQL='select * from user where username=? and state=1'
    db.query(getInfoByNameSQL,req.body.username,(err,results)=>{
        if(err)return res.err(err)
        if(results.length!==1) return res.err('用户不存在！')
        const comparePassword=results[0].password===req.body.password
        if(!comparePassword)return res.err('密码错误！')
        const token=jwt.sign({...results[0],password:''},config.jwtSecretKey,{
            expiresIn: config.expiresIn
        })
        res.ok('ok',{
            token
        })
    })
}

// 根据角色获取模块和权限
exports.getModulesAndRolesById=(req,res)=>{
    const getModuleSQL="SELECT parent_id,module_id, label,`key`,menu FROM module_view where character_id=? and state=1"
    const character_id=req.auth.character_id
    db.query(getModuleSQL,character_id,(err,results)=>{
        if(err)return res.ok(err)
        const routerModules=results
        const menuModules=NodesToTree(routerModules.filter(item=>item.menu===1),'module_id','parent_id',0)
        const getOperationSQL="SELECT role_key FROM character_roles_view where character_id=?"
        db.query(getOperationSQL,character_id,(err,results)=>{
            if(err)return res.ok(err)
            res.ok('ok',{
                data:{
                    menuModules,//用于menu的
                    operations:results.map(item=>item.role_key),
                    routerModules //渲染路由的
                }
            })
        })
        
    })
}

// 根据id获取用户信息
exports.getUserInfo=(req,res)=>{
    const getInfoByIdSQL="select u.*,c.`name` as character_name,c.`key` as character_key from user u join characters c on c.id=u.character_id where u.id=?"
    // const getInfoByIdSQL="select * from user where id=?"
    db.query(getInfoByIdSQL,req.auth.id,(err,results)=>{
        if(err)return res.ok(err)
        res.ok('ok',{
            data:{...results[0],password:''}
        })
    })
    
}

// 更新用户信息
exports.updateUserInfo=(req,res)=>{
    const selectBeforeUpdateSQL="select username from user where username=? and username<>?"
    const oldusername=req.auth.username
    const newusername=req.body.username
    db.query(selectBeforeUpdateSQL,[newusername,oldusername],(err,results)=>{
        if(err)return res.ok(err)
        if(results.length===1)return res.err('用户已存在！')
        const updateUserSQL="update user set ? where id=?"
        db.query(updateUserSQL,[req.body,req.auth.id],(err,results)=>{
            if(err)return res.ok(err)
            if(results.affectedRows!==1)return res.err('修改失败')
            res.ok('修改成功')
        })
    })
}

// 上传图片
exports.uploadImage=(req,res)=>{
    const updateImgSQL='update user set image_url=? where id=?'
    let image_url="http://localhost:8080"+'\/uploads\/'+req.file.filename
    db.query(updateImgSQL,[image_url,req.auth.id],(err,results)=>{
        if(err)return res.ok(err)
        res.ok('上传成功！',{
            image_url
        })
    })
    
}
