import React,{ useEffect } from 'react'
import { DeleteFilled ,EditOutlined } from '@ant-design/icons';
import { aliveUser,deleteUser,stopUser } from '../../request/user';
import { Button,Modal,Table,Switch,Tooltip} from 'antd';
import AdminStore from '@/tstore/adminStore'
import SearchComponent from './SearchComponent';
import AddModal from './AddModal';
import EditModal from './EditModal';
import { observer } from 'mobx-react';
import { useStores } from '@/tstore/useStores'

export default observer(()=>{
    const { UserStore } = useStores()

    //初始化
    useEffect(()=>{
        UserStore.requireCharacters()
    },[])

    //监听
    useEffect(() => {
        UserStore.requireUserList(1)
    }, [UserStore.currentPage,UserStore.keyValue]);

    //删除用户
    const deleteRow=(id)=>{
        Modal.confirm({
            title: '你确定要删除吗？',
            cancelText:'取消',
            okText:'确定',
            onOk() {
                deleteUser({id})
                UserStore.requireUserList()
            },
        });
    }

    // 编辑用户
    const editRow=(info)=>{
        UserStore.setUserInfo(JSON.stringify({
            id:info.id,
            character_id:info.character_id,
            username:info.username,
        }))
        UserStore.setIsEditVisible(true)
    }

    const changeState=async (checked,id)=>{
        const res=checked?await aliveUser({id}):await stopUser({id})
        if(res.data.status===200)UserStore.requireUserList()
    }
    
    //表格
    let columns = [
        {
            title: '用户名',
            dataIndex: 'username',
            align:'center',
        },
        {
            title: '性别',
            dataIndex: 'sex',
            width:80,
            align:'center',
            render: text => <span>{text?text:"/"}</span>,
        },
        {
            title: '角色',
            dataIndex: 'character_name',
            align:'center',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            align:'center',
            width:150,
            render: text => <span>{text?text:"/"}</span>,
        },
        
        {
            title: '创建时间',
            dataIndex: 'create_time',
            width:200,
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
            key:'operation',
            render: (text,record) => {
                if(record.character_id===1){ //不删除超级管理员和游客
                    return '/'
                }else {
                    return <span>   
                       {
                             AdminStore.modules.operations.find(item=>item==='userUpdate')&&<Tooltip title="更改角色">
                                <Button shape="circle" type='primary' icon={<EditOutlined />} onClick={()=>{editRow(record)}} style={{marginRight:'1em'}}/>
                            </Tooltip>
                       }
                       {
                            AdminStore.modules.operations.find(item=>item==='userDelete')&&<Tooltip title="删除">
                                <Button shape="circle" danger icon={<DeleteFilled />} onClick={()=>{deleteRow(record.id)}} style={{marginRight:'1em'}}/>
                            </Tooltip>
                       }
                    </span>
                }
            }
        },
    ];

  return (
        <div>
            <AddModal 
                isVisible={UserStore.isAddVisible} 
                close={()=>{UserStore.setIsAddVisible(false)}} 
                getUserList={()=>{
                    UserStore.setCurrentPage(1)
                    UserStore.setKeyValue("")
                }}

            />
            <EditModal
                isVisible={UserStore.isEditVisible} 
                close={()=>{UserStore.setIsEditVisible(false)}} 
                userInfo={UserStore.userInfo}
                getUserList={()=>{UserStore.requireUserList(1)}}
            />

            <SearchComponent 
                addUser={()=>{UserStore.setIsAddVisible(true)}} 
                search={(values)=>{
                    if(UserStore.currentPage!==1){UserStore.setCurrentPage(1)}
                    UserStore.setKeyValue(values)
                }}
            />
            <Table 
                rowKey={item=>item.id}
                columns={AdminStore.modules.operations.some(item=>item==='userDelete'||item==='userUpdate')?columns:columns.slice(0,6)} 
                dataSource={UserStore.userList.length!==0?UserStore.userList:[]} 
                pagination={{
                    pageSize:UserStore.pageSize,
                    current:UserStore.currentPage,
                    total:UserStore.total,
                    onChange:(value)=>{UserStore.setCurrentPage(value)}
                }}/>
        
        </div>
  )
})


