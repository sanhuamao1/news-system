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