import React,{ useEffect,useRef,useState } from 'react'
import { DeleteFilled ,EditOutlined } from '@ant-design/icons';
import { getUserList,aliveUser,deleteUser,stopUser } from '../../request/user';
import { Button,Modal,Table,Switch} from 'antd';
import {AdminStore,UserStore} from '../../store/index';
import SearchComponent from './SearchComponent';
import AddModal from './AddModal';
import EditModal from './EditModal';

export default function UserList() {
    const {current:pageSize}=useRef(5)
    const [userlist, setuserlist] = useState([]); //列表
    const [currentPage, setcurrentPage] = useState(1);//当前页
    const [keyvalue, setkeyvalue] = useState({});//搜索关键词
    const [total, settotal] = useState(0);//总条数
    const [isAddVisible, setIsAddVisible] = useState(false);//新增模态框
    const [isEditVisible, setIsEditVisible] = useState(false);//编辑模态框
    const [userinfo, setuserinfo] = useState("");//编辑信息
  
    //获取列表函数 默认值
    const getList=((params)=>{
        getUserList({...params}).then(res=>{
            setuserlist(res.data.data)
            if(total!==res.data.total){settotal(res.data.total)}
        })
    })

    //初始化
    useEffect(()=>{
        UserStore.requireCharacters()
    },[])

    //初始化：监听状态+初始化
    useEffect(() => {
        getList({currentPage,pageSize,...keyvalue})
    }, [currentPage,keyvalue]);

    //删除用户
    const deleteRow=(id)=>{
        Modal.confirm({
            title: '你确定要删除吗？',
            cancelText:'取消',
            okText:'确定',
            onOk() {
                deleteUser({id})
                getList({currentPage:1,pageSize})
            },
        });
    }

    // 编辑用户
    const editRow=(info)=>{
        setuserinfo(JSON.stringify({
            id:info.id,
            character_id:info.character_id,
            username:info.username,
        }))
        setIsEditVisible(true)
    }

    const changeState=(checked,id)=>{
        if(checked){
            aliveUser({id})
        }else{
            stopUser({id})
        }
        getList({currentPage:1,pageSize})
    }


    
    //表格
    let columns = [
        {
            title: '用户名',
            dataIndex: 'username',
            align:'center',
            key:'username',
        },
        {
            title: '性别',
            dataIndex: 'sex',
            width:80,
            align:'center',
            key: 'sex',
            render: text => <span>{text?text:"/"}</span>,
        },
        {
            title: '角色',
            dataIndex: 'character_name',
            align:'center',
            key: 'character_name',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            align:'center',
            width:150,
            ky:"'email",
            render: text => <span>{text?text:"/"}</span>,
        },
        
        {
            title: '创建时间',
            dataIndex: 'create_time',
            width:200,
            key:'create_time',
            render: text => <span>{text.replace("T", ' ').replace(".000Z","")}</span>
        },
        {
            title: '状态',
            dataIndex: 'state',
            width:100,
            align:'center',
            key:'state',
            render:(text,record)=> AdminStore.modules.operations.includes('userState')?
                    <Switch disabled={record.character_id===1} checkedChildren="正常" unCheckedChildren="已停用" checked={text} onChange={(checked)=>{changeState(checked,record.id)}}/>:
                    <span>{text?<span>正常</span>:<span style={{color:'red'}}>已停用</span>}</span>
            
        },
        {
            title: '操作',
            dataIndex: 'state',
            align:'center',
            key:'operation',
            render: (text,record) => {
                if(record.character_id===1){ //不删除超级管理员和游客
                    return '/'
                }else {
                    return <span>   
                       {
                            AdminStore.modules.operations.map(item=>{
                                if(item==='userDelete'){return <Button danger size='small' icon={<DeleteFilled />} style={{marginRight:'1em'}} onClick={()=>{deleteRow(record.id)}}>删除</Button>}
                                if(item==='userUpdate'){return <Button type='primary' size='small' icon={<EditOutlined />} onClick={()=>{editRow(record)}}>更改角色</Button>}
                            })
                       }
                    </span>
                }
            }
        },
    ];

  return (
    <div>
        <AddModal 
            isVisible={isAddVisible} 
            close={()=>{setIsAddVisible(false)}} 
            getList={()=>{getList({currentPage:1,pageSize,...keyvalue})}}
        />
        <EditModal
            isVisible={isEditVisible} 
            close={()=>{setIsEditVisible(false)}} 
            userinfo={userinfo}
            getList={()=>{getList({currentPage:1,pageSize,...keyvalue})}}
        />

        <SearchComponent 
            addUser={()=>{setIsAddVisible(true)}} 
            search={(values)=>{
                if(currentPage!==1){setcurrentPage(1)}
                setkeyvalue(values)
            }}
        />
        <Table 
            rowKey={item=>item.id}
            columns={AdminStore.modules.operations.some(item=>item==='userDelete'||item==='userUpdate')?columns:columns.slice(0,6)} 
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


