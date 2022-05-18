
const db=require('../db')
const {sqlConcat,sqlCount}=require('../utils/sqlhandler')

//获取用户列表
exports.getList=(req,res)=>{
    const head="SELECT id,username,sex,email,character_name,character_id,create_time,state FROM userlist_view"
    db.query(sqlCount('userlist_view',req.query),(err,result)=>{
        if(err)return res.err(err)
        const total=result[0].total
        if(total){
            db.query(sqlConcat(head,req.query,'create_time desc'),(err,results)=>{
                if(err)return res.err(err)
                res.ok('ok',{
                    data:results,
                    total
                })
            })
        }else{
            res.ok('ok',{
                data:[],
                total
            })
        }
    })
}

// 获取角色列表
exports.getCharactersOptions=(req,res)=>{
    const getCharactersOptionsSQL="SELECT id,`name` FROM characters;"
    db.query(getCharactersOptionsSQL,(err,results)=>{
        if(err)return res.err(err)
        res.ok('ok',{
            data:results,
        })
    })
}

// 添加用户
exports.addUser=(req,res)=>{
    const addUserSQL='insert into user set ?'
    db.query(addUserSQL,[req.body],(err,data)=>{
        if(err) return res.err(err)
        res.ok('添加成功！')
    })
}

// 修改角色，仅限修改角色
exports.updateUser=(req,res)=>{
    const updateUserSQL=`update user set character_id=${req.body.character_id} where id=${req.body.id}`
    db.query(updateUserSQL,(err,data)=>{
        if(err) return res.err(err)
        res.ok('更改成功！')
    })
}

// 删除用户
exports.deleteUser=(req,res)=>{
    const SQL=`delete from user where id=?`
    db.query(SQL,req.query.id,(err,data)=>{
        if(err) return res.err(err)
        res.ok('删除成功')
    })
}

// 停用角色
exports.stopUser=(req,res)=>{
    const SQL=`update user set state=0 where id=?`
    db.query(SQL,req.query.id,(err,data)=>{
        if(err) return res.err(err)
        res.ok('停用成功')
    })
}

// 恢复用户
exports.aliveUser=(req,res)=>{
    const SQL=`update user set state=1 where id=?`
    db.query(SQL,req.query.id,(err,data)=>{
        if(err) return res.err(err)
        res.ok('恢复成功')
    })
}