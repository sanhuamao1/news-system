# news-system
新闻发布系统

# Json server
https://www.npmjs.com/package/json-server
```
npm install -g json-server
json-server --watch db.json
```
## axios
```
axios.[method](url,{data})
```
- 增：poat
- 删：delete
- 改：patch
- 查：get

# 表关联
https://www.cnblogs.com/ymnets/p/3452364.html


# 隐藏列表
```css
.ant-upload-list.ant-upload-list-text{
    display: none;
}
```

```
 "ER_BAD_FIELD_ERROR: Unknown column 'character_id' in 'field list'"
 表里没这个字段
 ------------
首先我的表确实没有这个字段
我传了一个对象是
info:{
    character_id:2,
    key:...,
    name:...
}
接着我把里面的character_id取出来，使character_id=info.character_id，然后
const baseSQL="update characters set ? where id=?"
db.query(baseSQL,[info,character_id],(err,data)=>{}
这样写当然会报错啦，因为我没有把info里面的character_id处理一下就交给set，自然找不到这个字段

 
```
# 富文本
- onBlur
![图 1](images/2022-05-15-%E7%BC%96%E8%BE%91%E5%99%A8.png)  
https://github.com/facebook/draft-js

- 判断
![图 2](images/2022-05-15-%E7%BC%96%E8%BE%91%E5%99%A8%E5%86%85%E5%AE%B9%E5%88%A4%E6%96%AD.png)  

- 字段
![图 4](images/2022-05-15-%E5%AD%97%E6%AE%B5.png)  
- 加个通知
- 详情
![图 5](images/2022-05-15-%E8%AF%A6%E6%83%85.png)  

获取草稿列表，用户与状态过滤出
1.详情 preview
2.编辑
3.删除
4.提交
![图 6](images/2022-05-15-%E8%B7%AF%E7%94%B1.png)  
![图 7](images/2022-05-15-ss.png)  

不放在做别侧边栏的路由---加个字段--对应权限
![图 8](images/2022-05-15-%E8%B7%B3%E8%BD%AC.png)  

pageheader组件
根据路由的id获取详情
![图 9](images/2022-05-15-ww.png)  

