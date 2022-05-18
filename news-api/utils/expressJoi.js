const Joi = require('joi')

// schemas：验证规则
// options：配置
const expressJoi = function (schemas, options = { strict: false }) {
    
    // 01 非严格模式
    if (!options.strict) {
        // allowUnknown 允许提交未定义的参数项，默认值false
        // stripUnknown 过滤掉那些未定义的参数项，默认值false
        // 下面将改为允许提交未定义参数项，不过滤未定义参数项，并且把多余的配置项解构出来
        options = { allowUnknown: true, stripUnknown: true, ...options }
    }

    // strict是自己定义的，由于现在没什么作用了，且joi选项本身不包含该项，故删除掉
    delete options.strict

    // 02 定义中间件
    // 分别对body、query、params的内容进行验证
    return function (req, res, next) {
        
        ['body', 'query', 'params'].forEach(key => {
            // 如果用户没有传入该数组中的项，跳过
            if (!schemas[key]) return

            // 用户传入了该数组中的项，那么对每一项里面的内容进行验证
            // 比如说上面写了body，那么这里的schemas[key]就是body里面的内容
            // 03 通过Joi.object()转为官网要求的类型，可以把schema理解为规则
            const schema = Joi.object(schemas[key])
            // 04 validate()用于验证内容是否符合规则，并返回一个对象,
            // 这个对象中error表示验证失败后返回的信息，value表示传进来的需要验证的内容
            // 该方法允许传入需要验证的内容和配置

            const { error, value } = schema.validate(req[key], options)

            // 如果上面返回了error，说明验证失败，抛出错误
            // 否则就是验证成功，接着把传进来的信息挂载到req属性中，比如req.body
            if (error) {
                throw error
            } else {
                req[key] = value
            }
        })
        next()
    }
}

module.exports = expressJoi