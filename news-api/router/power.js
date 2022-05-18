const express = require("express");
const router=express.Router()
const powerHandler=require('../router-handler/power')
const expressJoi=require('../utils/expressJoi')
const  {character_base_schema}=require('../schema/power')


router.get('/getcharacters',powerHandler.getCharacters) //获取所有角色
router.post('/addcharacter',powerHandler.addCharacter) //添加角色
router.post('/updatecharacter',powerHandler.updateCharacter) //更新角色
router.get('/deletecharacter',powerHandler.deleteCharacter) //删除角色
router.get('/stopcharacter',powerHandler.stopCharacter) //停用角色
router.get('/alivecharacter',powerHandler.aliveCharacter) //恢复角色
router.get('/getallopenmodules',powerHandler.getAllOpenModules) //获取所有开启的模块
router.get('/getrolesbymodule',powerHandler.getRolesByModule) //过滤出有权限的模块
router.get('/isnewcharaterexist',expressJoi(character_base_schema),powerHandler.isNewCharaterExist) //判断新角色名称是否存在
router.get('/ischaracterexist',powerHandler.isCharaterExist) //判断角色是否存在，不考虑自己
router.get('/getmoduleidandroleid-byid',powerHandler.getModuleidAndRoleidByid)
router.get('/getallmodulesandrole',powerHandler.getAllModulesAndRoles) //获取所有模块和权限
router.get('/stopmodule',powerHandler.stopModule) //停用模块
router.get('/alivemodule',powerHandler.aliveModule) //恢复模块









module.exports=router