const express=require('express')
const app=express()
const port=8080
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
const cors=require('cors')
app.use(cors())
app.use('/uploads', express.static('./uploads'))


// msg中间件
const {okmw,errmw}=require('./utils/msg')
app.use(okmw)
app.use(errmw)

//解析token
const config=require('./config')
const {expressjwt: jwt}=require('express-jwt')
app.use(
	jwt({
        secret:config.jwtSecretKey,
        algorithms: ["HS256"],
    }).unless({path:[/^\/admin\/|^\/uploads\//]})
)

// 路由
const admin=require('./router/admin')
const user=require('./router/user')
const power=require('./router/power')
const news=require('./router/news')
app.use(admin)
app.use('/api',user)
app.use('/api',power)
app.use('/api',news)




// 错误全局拦截
const Joi=require('joi')
app.use((err,req,res,next)=>{
    if(err.name === 'UnauthorizedError') return res.err('身份认证失败！')
    if(err instanceof Joi.ValidationError) return res.err(err)
    res.err(err)
})
app.listen(port,()=>{
    console.log(`服务器运行在http://localhost:${port}`)
})