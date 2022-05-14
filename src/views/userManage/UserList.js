import React,{ useEffect,useRef,useState } from 'react'
import { DeleteFilled ,RedoOutlined } from '@ant-design/icons';
import { getUserList,aliveUser,deleteUser,stopUser } from '../../request/user';
import { Button,Modal,Table,Switch} from 'antd';
import {AdminStore,UserStore} from '../../store/index';
import SearchComponent from './SearchComponent';
import AddModalComponent from './AddModalComponent';

export default function UserList() {
    const {current:pageSize}=useRef(8)
    const [userlist, setuserlist] = useState([]); //列表
    const [currentPage, setcurrentPage] = useState(1);//当前页
    const [keyvalue, setkeyvalue] = useState({});//搜索关键词
    const [total, settotal] = useState(0);//总条数
    const [isVisible, setIsVisible] = useState(false);//模态框
  
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

    //监听状态+初始化
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
        },
        {
            title: '性别',
            dataIndex: 'sex',
            render: text => <span>{text?text:"/"}</span>,
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            align:'center',
            render: text => <span>{text?text:"/"}</span>,
        },
        {
            title: '角色',
            dataIndex: 'character_name',
            align:'center'
        },
        {
            title: '更新时间',
            dataIndex: 'create_time',
            align:'center',
            render: text => <span>{text.replace("T", ' ').replace(".000Z","")}</span>
        },
        {
            title: '状态',
            dataIndex: 'state',
            width:100,
            align:'center',
            render:(text,record)=> AdminStore.modules.operations.includes('userState')?
                    <Switch disabled={record.character_id===1} checkedChildren="正常" unCheckedChildren="已停用" checked={text} onChange={(checked)=>{changeState(checked,record.id)}}/>:
                    <span>{text?<span>正常</span>:<span style={{color:'red'}}>已停用</span>}</span>
            
        },
        {
            title: '操作',
            dataIndex: 'state',
            align:'center',
            render: (text,record) => {
                if(record.character_id===1){
                    return ''
                }else {
                    return <Button danger size='small' icon={<DeleteFilled />} onClick={()=>{deleteRow(record.id)}}>删除</Button>
                }
            }
        },
    ];

  return (
    <div>
        <AddModalComponent 
            isVisible={isVisible} 
            close={()=>{setIsVisible(false)}} 
            getList={()=>{getList({currentPage:1,pageSize,...keyvalue})}}
        />
        <SearchComponent 
            addUser={()=>{setIsVisible(true)}} 
            search={(values)=>{
                if(currentPage!==1){setcurrentPage(1)}
                setkeyvalue(values)
            }}
        />
        <Table 
            rowKey={item=>item.id}
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


