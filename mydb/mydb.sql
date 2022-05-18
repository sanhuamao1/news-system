-- MySQL dump 10.13  Distrib 5.5.36, for Win32 (x86)
--
-- Host: localhost    Database: mydb
-- ------------------------------------------------------
-- Server version	5.5.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `character_modules`
--

DROP TABLE IF EXISTS `character_modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `character_modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `character_id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_character_modules_moduleid` (`module_id`),
  KEY `idx_character_modules_characterid` (`character_id`),
  CONSTRAINT `fk_character_modules_characterid` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_character_modules_moduleid` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `character_modules`
--

LOCK TABLES `character_modules` WRITE;
/*!40000 ALTER TABLE `character_modules` DISABLE KEYS */;
INSERT INTO `character_modules` VALUES (1,1,1),(2,1,2),(3,1,3),(4,1,4),(5,1,5),(6,1,6),(7,1,7),(8,1,8),(9,1,9),(10,1,10),(12,1,12),(13,2,1),(14,2,4),(15,2,9),(16,2,10),(18,2,12),(19,5,1),(20,5,2),(70,3,1),(72,3,2),(73,3,7),(74,3,3),(75,6,1),(76,4,6),(77,4,9),(78,4,4),(79,4,1),(80,4,12),(81,1,13),(82,1,14),(83,1,15),(84,1,16),(87,4,2),(88,8,1),(89,8,2),(90,8,4),(91,8,10),(92,8,9),(93,8,13),(94,8,14),(95,8,5),(96,8,15);
/*!40000 ALTER TABLE `character_modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `character_modules_state_view`
--

DROP TABLE IF EXISTS `character_modules_state_view`;
/*!50001 DROP VIEW IF EXISTS `character_modules_state_view`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `character_modules_state_view` (
  `id` tinyint NOT NULL,
  `character_id` tinyint NOT NULL,
  `module_id` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `character_roles`
--

DROP TABLE IF EXISTS `character_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `character_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `character_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_character_roles_roleid` (`role_id`),
  KEY `idx_character_roles_characterid` (`character_id`),
  CONSTRAINT `fk_character_roles_characterid` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_character_roles_roleid` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `character_roles`
--

LOCK TABLES `character_roles` WRITE;
/*!40000 ALTER TABLE `character_roles` DISABLE KEYS */;
INSERT INTO `character_roles` VALUES (1,1,1),(2,1,2),(3,1,3),(4,1,4),(5,1,5),(6,1,6),(7,1,7),(8,1,8),(9,5,1),(22,1,9),(23,2,10),(24,2,1),(25,1,13),(29,3,5),(30,3,6),(31,3,1),(32,1,14),(33,1,17),(34,1,18),(35,1,19),(36,1,20),(37,4,10),(38,4,8),(39,4,7),(42,1,10),(44,4,1),(45,8,1);
/*!40000 ALTER TABLE `character_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `character_roles_view`
--

DROP TABLE IF EXISTS `character_roles_view`;
/*!50001 DROP VIEW IF EXISTS `character_roles_view`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `character_roles_view` (
  `role_id` tinyint NOT NULL,
  `role_name` tinyint NOT NULL,
  `role_key` tinyint NOT NULL,
  `character_id` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `characters`
--

DROP TABLE IF EXISTS `characters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `characters` (
  `id` int(2) NOT NULL AUTO_INCREMENT,
  `key` varchar(45) NOT NULL,
  `state` int(11) NOT NULL DEFAULT '1',
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_UNIQUE` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `characters`
--

LOCK TABLES `characters` WRITE;
/*!40000 ALTER TABLE `characters` DISABLE KEYS */;
INSERT INTO `characters` VALUES (1,'admin',1,'超级管理员','开放所有权限（不可删除）'),(2,'editor',1,'新闻编辑者','负责新闻编辑'),(3,'checker ',1,'新闻审核员','负责审核新闻'),(4,'publisher',0,'新闻发布者','负责新闻发布'),(5,'operator',0,'新闻运营','可查看新闻概况、分类、审核情况、发布情况等数据'),(6,'visitor',1,'游客','什么也干不了，后备项（不可删除）'),(8,'ttt',1,'天天','rr');
/*!40000 ALTER TABLE `characters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `module`
--

DROP TABLE IF EXISTS `module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `module` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) DEFAULT '0',
  `name` varchar(45) DEFAULT NULL,
  `key` varchar(45) NOT NULL,
  `state` int(11) DEFAULT '1',
  `menu` int(11) DEFAULT '1' COMMENT '判断是否为菜单路由',
  `order` int(11) DEFAULT '99',
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_UNIQUE` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `module`
--

LOCK TABLES `module` WRITE;
/*!40000 ALTER TABLE `module` DISABLE KEYS */;
INSERT INTO `module` VALUES (1,0,'首页','home',1,1,99),(2,0,'用户列表','user-manage/list',1,1,99),(3,0,'权限管理','power-manage',1,1,99),(4,0,'新闻管理','news-manage',1,1,99),(5,0,'审核管理','check-manage',1,1,99),(6,0,'发布管理','publish-manage',1,1,99),(7,3,'模块列表','power-manage/rolelist',1,1,2),(8,3,'角色列表','power-manage/characterlist',1,1,1),(9,4,'撰写新闻','news-manage/createdraft',1,1,1),(10,4,'草稿箱','news-manage/draft',1,1,2),(12,4,'分类列表','news-manage/sort',1,1,3),(13,4,'新闻预览','news-manage/preview/:id',1,0,99),(14,4,'编辑草稿','news-manage/draft/:id',1,0,99),(15,5,'审核列表','check-manage/list',1,1,99),(16,5,'审核新闻','check-manage/check',1,1,99);
/*!40000 ALTER TABLE `module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `module_view`
--

DROP TABLE IF EXISTS `module_view`;
/*!50001 DROP VIEW IF EXISTS `module_view`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `module_view` (
  `parent_id` tinyint NOT NULL,
  `module_id` tinyint NOT NULL,
  `label` tinyint NOT NULL,
  `key` tinyint NOT NULL,
  `character_id` tinyint NOT NULL,
  `menu` tinyint NOT NULL,
  `state` tinyint NOT NULL,
  `order` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `news_checklist_view`
--

DROP TABLE IF EXISTS `news_checklist_view`;
/*!50001 DROP VIEW IF EXISTS `news_checklist_view`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `news_checklist_view` (
  `id` tinyint NOT NULL,
  `title` tinyint NOT NULL,
  `sort_id` tinyint NOT NULL,
  `latest_check_id` tinyint NOT NULL,
  `publish_state` tinyint NOT NULL,
  `submit_time` tinyint NOT NULL,
  `check_person` tinyint NOT NULL,
  `check_state` tinyint NOT NULL,
  `check_time` tinyint NOT NULL,
  `check_comment` tinyint NOT NULL,
  `author_name` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `news_checks`
--

DROP TABLE IF EXISTS `news_checks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `news_checks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `check_time` varchar(45) DEFAULT NULL COMMENT '审核时间',
  `check_person` varchar(45) DEFAULT NULL COMMENT '审核人',
  `check_comment` varchar(45) DEFAULT NULL COMMENT '通过或不通过的原因',
  `news_id` int(11) NOT NULL,
  `submit_time` varchar(45) DEFAULT NULL,
  `check_result` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_news_checks_news1_idx` (`news_id`),
  KEY `fk_check_peson_idx` (`check_person`),
  CONSTRAINT `fk_check_person` FOREIGN KEY (`check_person`) REFERENCES `user` (`username`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_news_checks_news1` FOREIGN KEY (`news_id`) REFERENCES `news_detail` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news_checks`
--

LOCK TABLES `news_checks` WRITE;
/*!40000 ALTER TABLE `news_checks` DISABLE KEYS */;
INSERT INTO `news_checks` VALUES (3,'2022-05-17 10:05:36','admin',NULL,7,'2022-05-10 15:48:00',1),(18,'2022-05-17 10:31:05','admin',NULL,15,'2022-05-17 10:09:46',2),(20,'2022-05-17 10:31:56','admin','行了行了',15,'2022-05-17 10:31:14',1),(21,'2022-05-17 11:25:03','admin','不太行',22,'2022-05-17 11:23:33',2);
/*!40000 ALTER TABLE `news_checks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news_comments`
--

DROP TABLE IF EXISTS `news_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `news_comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `commnet_name` varchar(45) DEFAULT NULL,
  `comment_time` varchar(45) DEFAULT NULL,
  `comment_content` varchar(45) DEFAULT NULL,
  `news_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_news_conments_news1_idx` (`news_id`),
  CONSTRAINT `fk_news_conments_news1` FOREIGN KEY (`news_id`) REFERENCES `news_detail` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news_comments`
--

LOCK TABLES `news_comments` WRITE;
/*!40000 ALTER TABLE `news_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `news_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news_detail`
--

DROP TABLE IF EXISTS `news_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `news_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) CHARACTER SET utf8 NOT NULL,
  `content` text CHARACTER SET utf8 NOT NULL,
  `check_state` int(11) DEFAULT '1' COMMENT '1-草稿；2-正在审核；3-已通过；4-未通过',
  `create_time` varchar(45) CHARACTER SET utf8 NOT NULL,
  `star` int(11) DEFAULT '0',
  `view` int(11) DEFAULT '0',
  `update_time` varchar(45) COLLATE utf8_esperanto_ci DEFAULT NULL,
  `publish_state` int(11) DEFAULT '1' COMMENT '1-未审核或正在审核；2-待发布（审核通过）3-已发布；4-已下线',
  `sort_id` int(11) NOT NULL,
  `latest_check_id` int(11) DEFAULT NULL,
  `comment` int(11) DEFAULT '0',
  `author_name` varchar(45) COLLATE utf8_esperanto_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sort_id_idx` (`sort_id`),
  KEY `fk_latest_check_id_idx` (`latest_check_id`),
  KEY `fk_author_name_idx` (`author_name`),
  CONSTRAINT `fk_latest_check_id` FOREIGN KEY (`latest_check_id`) REFERENCES `news_checks` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_sort_id` FOREIGN KEY (`sort_id`) REFERENCES `news_sorts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8 COLLATE=utf8_esperanto_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news_detail`
--

LOCK TABLES `news_detail` WRITE;
/*!40000 ALTER TABLE `news_detail` DISABLE KEYS */;
INSERT INTO `news_detail` VALUES (7,'这是一个标题','<p><br></p>',3,'2022-05-15 15:36:03',0,0,'2022-05-15 15:28:31',3,1,3,0,'admin'),(13,'这样子可以吗','<p>哈哈哈哈就是好真的假的</p>',4,'2022-05-15 23:35:38',0,0,'2022-05-17 10:25:03',1,2,NULL,0,'admin'),(15,'我再试试3333','<p>可以吗宝</p>',3,'2022-05-16 11:29:13',0,0,'2022-05-17 10:31:14',4,3,20,0,'admin'),(21,'sgfisgfus','<p>haowenzi</p>',1,'2022-05-17 11:18:08',0,0,'2022-05-17 11:18:08',1,6,NULL,0,'admin'),(22,'guisgvosd','<p>sss</p>',4,'2022-05-17 11:23:33',0,0,'2022-05-17 11:23:33',1,1,21,0,'admin'),(23,'dddddd','<p>1111</p>',1,'2022-05-17 11:24:17',0,0,'2022-05-17 11:24:17',1,5,NULL,0,'admin');
/*!40000 ALTER TABLE `news_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `news_draflist_view`
--

DROP TABLE IF EXISTS `news_draflist_view`;
/*!50001 DROP VIEW IF EXISTS `news_draflist_view`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `news_draflist_view` (
  `id` tinyint NOT NULL,
  `title` tinyint NOT NULL,
  `update_time` tinyint NOT NULL,
  `create_time` tinyint NOT NULL,
  `author_name` tinyint NOT NULL,
  `check_state` tinyint NOT NULL,
  `sort_id` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `news_sorts`
--

DROP TABLE IF EXISTS `news_sorts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `news_sorts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `color` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news_sorts`
--

LOCK TABLES `news_sorts` WRITE;
/*!40000 ALTER TABLE `news_sorts` DISABLE KEYS */;
INSERT INTO `news_sorts` VALUES (1,'时事新闻','geekblue'),(2,'环球经济','red'),(3,'科学技术','purple'),(4,'军事世界','#D8AD87'),(5,'世界体育','#818BD7'),(6,'生活理财','#D47799'),(7,'人文历史','#DEBD98');
/*!40000 ALTER TABLE `news_sorts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `role_module_view`
--

DROP TABLE IF EXISTS `role_module_view`;
/*!50001 DROP VIEW IF EXISTS `role_module_view`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `role_module_view` (
  `id` tinyint NOT NULL,
  `name` tinyint NOT NULL,
  `key` tinyint NOT NULL,
  `module_id` tinyint NOT NULL,
  `module_name` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `key` varchar(45) NOT NULL,
  `module_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`module_id`),
  UNIQUE KEY `key_UNIQUE` (`key`),
  KEY `fk_role_module1_idx` (`module_id`),
  CONSTRAINT `fk_role_module1` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'增加用户','userAdd',2),(2,'删除用户','userDelete',2),(3,'增加角色','characterAdd',8),(4,'更改角色状态','characterState',8),(5,'增改分类','sortAddUpdate',12),(6,'删除分类','sortDelete',12),(7,'删除发布','publishDelete',6),(8,'更改发布','publishUpdate',6),(9,'删除角色','characterDelete',8),(10,'查看全部审核列表','checkAll',15),(13,'修改角色','characterUpdate',8),(14,'更新用户状态','userState',2),(17,'更新模块状态','moduleState',7),(18,'增加模块','moduleAdd',7),(19,'更改模块','moduleUpdate',7),(20,'更新用户','userUpdate',2);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `sex` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `character_id` int(2) NOT NULL DEFAULT '6',
  `image_url` varchar(255) DEFAULT NULL,
  `state` int(11) DEFAULT '1' COMMENT '0为被删除\n1为存在',
  PRIMARY KEY (`id`,`character_id`),
  UNIQUE KEY `name_UNIQUE` (`username`),
  KEY `fk_user_character1_idx` (`character_id`),
  CONSTRAINT `fk_character_users_character_id` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','123456','2022-05-09 14:12:34','女','1342226@qq.com',1,'http://localhost:8080/uploads/7uTfKR1vwOUULc2rO1woB7wx.jpg',1),(2,'111111','111111','2022-05-09 14:12:34','',NULL,3,'http://localhost:8080/uploads/naBfaeTL6gFtPM1qW6I2l2N7.jpg',1),(3,'123456','123456','2022-05-09 14:12:34','',NULL,3,NULL,1),(5,'222222','222222','2022-05-18 09:50:32','',NULL,6,NULL,1),(6,'444444','444444','2022-05-09 14:50:04',NULL,NULL,3,NULL,1),(7,'555555','555555','2022-05-18 07:39:50',NULL,NULL,3,NULL,0),(10,'666666','666666','2022-05-11 03:00:51','',NULL,3,NULL,1),(11,'777777','777777','2022-05-18 07:39:38','',NULL,3,NULL,1),(12,'888888','888888','2022-05-18 07:38:57','男','235732@qq.com',3,NULL,1),(13,'admin123','admin123','2022-05-18 07:49:43','',NULL,2,NULL,1),(15,'3333','3333','2022-05-18 09:50:32','',NULL,6,NULL,1),(16,'343434','343434','2022-05-18 07:50:13','男','2452rw@qq.com',3,NULL,1),(17,'66666666','66666666','2022-05-18 07:52:55','','6666666@qq.com',2,NULL,1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `userlist_view`
--

DROP TABLE IF EXISTS `userlist_view`;
/*!50001 DROP VIEW IF EXISTS `userlist_view`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `userlist_view` (
  `id` tinyint NOT NULL,
  `username` tinyint NOT NULL,
  `sex` tinyint NOT NULL,
  `email` tinyint NOT NULL,
  `character_name` tinyint NOT NULL,
  `character_id` tinyint NOT NULL,
  `create_time` tinyint NOT NULL,
  `state` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `character_modules_state_view`
--

/*!50001 DROP TABLE IF EXISTS `character_modules_state_view`*/;
/*!50001 DROP VIEW IF EXISTS `character_modules_state_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `character_modules_state_view` AS select `cm`.`id` AS `id`,`cm`.`character_id` AS `character_id`,`cm`.`module_id` AS `module_id` from (`character_modules` `cm` join `module` `m` on((`cm`.`module_id` = `m`.`id`))) where (`m`.`state` = 1) order by `cm`.`character_id`,`cm`.`module_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `character_roles_view`
--

/*!50001 DROP TABLE IF EXISTS `character_roles_view`*/;
/*!50001 DROP VIEW IF EXISTS `character_roles_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `character_roles_view` AS select `r`.`id` AS `role_id`,`r`.`name` AS `role_name`,`r`.`key` AS `role_key`,`cr`.`character_id` AS `character_id` from (`character_roles` `cr` join `roles` `r` on((`r`.`id` = `cr`.`role_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `module_view`
--

/*!50001 DROP TABLE IF EXISTS `module_view`*/;
/*!50001 DROP VIEW IF EXISTS `module_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `module_view` AS select `m`.`parent_id` AS `parent_id`,`m`.`id` AS `module_id`,`m`.`name` AS `label`,`m`.`key` AS `key`,`cm`.`character_id` AS `character_id`,`m`.`menu` AS `menu`,`m`.`state` AS `state`,`m`.`order` AS `order` from (`module` `m` join `character_modules` `cm` on((`m`.`id` = `cm`.`module_id`))) order by `cm`.`character_id`,`m`.`parent_id`,`m`.`id`,`m`.`order` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `news_checklist_view`
--

/*!50001 DROP TABLE IF EXISTS `news_checklist_view`*/;
/*!50001 DROP VIEW IF EXISTS `news_checklist_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `news_checklist_view` AS select `nd`.`id` AS `id`,`nd`.`title` AS `title`,`nd`.`sort_id` AS `sort_id`,`nd`.`latest_check_id` AS `latest_check_id`,`nd`.`publish_state` AS `publish_state`,`nc`.`submit_time` AS `submit_time`,`nc`.`check_person` AS `check_person`,`nd`.`check_state` AS `check_state`,`nc`.`check_time` AS `check_time`,`nc`.`check_comment` AS `check_comment`,`nd`.`author_name` AS `author_name` from (`news_detail` `nd` join `news_checks` `nc` on((`nd`.`latest_check_id` = `nc`.`id`))) where (`nd`.`check_state` <> 1) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `news_draflist_view`
--

/*!50001 DROP TABLE IF EXISTS `news_draflist_view`*/;
/*!50001 DROP VIEW IF EXISTS `news_draflist_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `news_draflist_view` AS select `nd`.`id` AS `id`,`nd`.`title` AS `title`,`nd`.`update_time` AS `update_time`,`nd`.`create_time` AS `create_time`,`nd`.`author_name` AS `author_name`,`nd`.`check_state` AS `check_state`,`ns`.`id` AS `sort_id` from (`news_detail` `nd` join `news_sorts` `ns` on((`nd`.`sort_id` = `ns`.`id`))) where (`nd`.`check_state` = 1) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `role_module_view`
--

/*!50001 DROP TABLE IF EXISTS `role_module_view`*/;
/*!50001 DROP VIEW IF EXISTS `role_module_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `role_module_view` AS select `r`.`id` AS `id`,`r`.`name` AS `name`,`r`.`key` AS `key`,`r`.`module_id` AS `module_id`,`m`.`name` AS `module_name` from (`roles` `r` join `module` `m` on((`r`.`module_id` = `m`.`id`))) order by `r`.`module_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `userlist_view`
--

/*!50001 DROP TABLE IF EXISTS `userlist_view`*/;
/*!50001 DROP VIEW IF EXISTS `userlist_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `userlist_view` AS select `u`.`id` AS `id`,`u`.`username` AS `username`,`u`.`sex` AS `sex`,`u`.`email` AS `email`,`c`.`name` AS `character_name`,`c`.`id` AS `character_id`,`u`.`create_time` AS `create_time`,`u`.`state` AS `state` from (`user` `u` join `characters` `c` on((`u`.`character_id` = `c`.`id`))) order by `u`.`create_time` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-18 21:13:41
