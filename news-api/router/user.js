const express = require("express");
const router=express.Router()
const userHandler=require('../router-handler/user')
const expressJoi=require('../utils/expressJoi')
const {adduser_schema,updateuser_schema} =require('../schema/user')

router.get('/getuserlist',userHandler.getList)
router.get('/getcharactersoptions',userHandler.getCharactersOptions)
router.post('/adduser',expressJoi(adduser_schema),userHandler.addUser)
router.post('/updateuser',expressJoi(updateuser_schema),userHandler.updateUser)
router.get('/deleteuser',userHandler.deleteUser)
router.get('/stopuser',userHandler.stopUser)
router.get('/aliveuser',userHandler.aliveUser)


module.exports=router