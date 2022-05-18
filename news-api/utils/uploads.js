const multer = require('multer') 
const path = require('path')
const stringRandom =require('string-random') //生成随机字符串，防止图片被随意获取

// 过滤文件
function fileFilter (req, file, cb) {
    let extname = path.extname(file.originalname) 
    let allow='.jpge|.png|.jpg'
    if(allow.includes(extname)){
        cb(null, true)  //表示通过
    }else{
        cb(new Error('仅支持'+allow+'文件格式'))
    }
}

// 存储引擎
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'))
    },
    // 文件名称
    filename: function (req, file, cb) {
        let extname = path.extname(file.originalname)  
        cb(null, stringRandom(24, { numbers: true })+ extname)
    }
})

const upload = multer({ 
    storage,
    fileFilter
 })
 module.exports=upload