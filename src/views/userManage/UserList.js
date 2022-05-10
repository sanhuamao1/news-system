import React,{useEffect,useState,useCallback} from 'react'
import {Table} from 'antd';
import { getUserList,getCharacters,aliveUser,deleteUser } from '../../request/user';
import { Form, Input, Select,Button,Modal} from 'antd';
import {AdminStore} from '../../store/index';
const { Option } = Select;
const { confirm } = Modal;

const addOperation=AdminStore.modules.operations.includes('userAdd')
const deleteOperation=AdminStore.modules.operations.includes('userDelete')




export default function UserList() {
  const [userlist, setuserlist] = useState([]); //列表
  const [currentPage, setcurrentPage] = useState(1);//当前页
  const [total, settotal] = useState(0);
  const [characters, setcharacters] = useState([]);
  const [keyvalue, setkeyvalue] = useState({});
  const pageSize=5
  

  //获取列表函数
  const getList=useCallback(()=>{
    getUserList({currentPage,pageSize,...keyvalue}).then(res=>{
      setuserlist(res.data.data)
      settotal(res.data.total)
    })
  },[currentPage,keyvalue,total])

  //初始化
  useEffect(()=>{
    getCharacters().then(res=>{
      setcharacters(res.data.data)
    })
    getList()
  },[])

  //监听状态
  useEffect(() => {
    getList()
  }, [currentPage,keyvalue]);

  let columns = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: text => <span>{text?text:"/"}</span>,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      render: text => <span>{text?text:"/"}</span>,
    },
    {
      title: '角色',
      dataIndex: 'character_name',
    },
    {
      title: '更新时间',
      dataIndex: 'create_time',
      render: text => <span>{text.replace("T", ' ').replace(".000Z","")}</span>
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: text => text? <span style={{color:'#52c41a'}}>正常</span>:<span style={{color:'#ff4d4f'}}>已停用</span>
    },
    {
      title: '操作',
      dataIndex: 'state',
      render: (text,record) => {
        if(record.character_id===1){
          console.log(record)
          return ''
        }else {
          if(text){return  <Button danger size='small' onClick={()=>{
            confirm({
              title: '你确定要删除吗？',
              cancelText:'取消',
              okText:'确定',
              onOk() {
                deleteUser({id:record.id})
                getList()
              },
            });
          }}>删除</Button>}else{
            return <Button style={{color:'#52c41a'}}  size='small' onClick={()=>{
              aliveUser({id:record.id})
              getList()
            }}>恢复使用</Button>
          }
        }
      }
    },
  ];

  return (
    <div>
      <SearchComponent characters={characters} search={(value)=>{
        setcurrentPage(1)
        setkeyvalue(value)
      }}/>
      <Table 
        columns={AdminStore.modules.operations.includes('userDelete')?columns:columns.slice(0,6)} 
        dataSource={userlist} 
        pagination={{
          pageSize,
          current:currentPage,
          total,
          onChange:(value)=>{setcurrentPage(value)}
        }}/>
    </div>
  )
}


const SearchComponent=({characters,search})=>(
  <Form layout="inline" style={{marginBottom:'1em'}} onFinish={search}>
    <Form.Item label="用户名" name="username">
      <Input/>
    </Form.Item>
    <Form.Item label="邮箱" name="email">
      <Input/>
    </Form.Item>
    <Form.Item label="角色" name="character_id" style={{width:'220px'}}>
      <Select>
        {characters.map(item=>
            <Option value={item.id} key={item.id}>{item.name}</Option>
        )}
      </Select>
    </Form.Item>
    
    <Form.Item>
        <Button type="primary" htmlType="submit">
          查询
        </Button>
        {
          AdminStore.modules.operations.includes('userAdd')?
          <Button type="primary" style={{marginLeft:'1em'}}>
            添加用户
          </Button>:''
        }
    </Form.Item>
  </Form>
)