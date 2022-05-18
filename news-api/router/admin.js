const express=require('express')
const router=express.Router()
const adminHandler=require('../router-handler/admin')
const {user_schema,userinfo_schema}=require('../schema/user')
const upload=require('../utils/uploads')
const expressJoi=require('../utils/expressJoi')

router.post('/admin/register',expressJoi(user_schema),adminHandler.register)
router.post('/admin/login',adminHandler.login)
router.get('/api/getmodulesandroles-byid',adminHandler.getModulesAndRolesById)
router.get('/api/getuserinfo',adminHandler.getUserInfo)
router.post('/upload/uploadimage',upload.single('image'),adminHandler.uploadImage)
router.post('/api/updateuserinfo',expressJoi(userinfo_schema),adminHandler.updateUserInfo)



module.exports=router