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
https://github.com/margox/braft-editor
https://github.com/sstur/react-rte

- 路径别名
![图 10](images/2022-05-15-%E5%88%AB%E5%90%8D.png)  


如果在审核中，修改后不能保存到草稿箱

![图 1](images/2022-05-17-%E8%87%AA%E5%AE%9A%E4%B9%89%E9%92%A9%E5%AD%90.png)  


![图 4](images/2022-05-17-%E5%87%BD%E6%95%B0.png)  

![图 5](images/2022-05-17-%E4%BC%A0%E5%80%BC.png)  

![图 7](images/2022-05-17-dd.png)  
