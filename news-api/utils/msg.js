/* 全局注册后可使用：res.err(err,status)
    @param {String|Error} err   错误信息 （*必填）
    @param {Number} status  错误状态码，默认为500
*/
const errmw=(req,res,next)=>{
    res.err=function(err,status=500){
        res.send({
            status,
            msg:err instanceof Error?err.message:err
        })
    }
    next()
}

/* 全局注册后可使用：res.ok(msg,data,status)
    @param {String|Error} msg   提示信息
    @param {Object} data  返回的数据
    @param {Number} status  状态码，默认为200
*/
const okmw=(req,res,next)=>{
    res.ok=function(msg='ok',data,status=200){
        res.send({
            status,
            msg,
            ...data
        })
    }
    next()
}

module.exports={
    errmw,okmw
}