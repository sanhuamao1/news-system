const db=require('../db')

//values可以是对象，可以是字符串
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

function queryT(sql,values,response){
    let res=response
    if(response===undefined){
        res=values //如果只传了两个参数，那么第二个参数values其实是res
    }
    return new Promise((resolve,reject)=>{
        db.query(sql,values,(err,rows)=>{
            if (err){db.rollback(()=>{res.err(err)});reject(err)}
            resolve(rows)
        })
    })
}


exports.query=query
exports.queryT=queryT


