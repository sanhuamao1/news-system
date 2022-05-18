import React,{useEffect} from 'react'
import AdminStore from '@/tstore/adminStore'
import { useStores } from '@/tstore/useStores'
import { observer } from 'mobx-react';
import { ExclamationCircleOutlined, EditOutlined,DeleteFilled} from '@ant-design/icons';
import { Button,Modal,Table,Tooltip,Switch } from 'antd';
import {
    stopCharacter,
    aliveCharacter,
    getModuleidAndRoleidByid,
    deleteCharacter
} from '@/request/power'
import ModalComponent from './ModalComponent';

export default observer(()=> {
    const {PowerStore}=useStores()

    //初始化
    useEffect(() => {
        PowerStore.requireCharacters(1)
    }, [PowerStore.currentPage]);
    
    const changeState=async(checked,id)=>{
        if(checked){
            await aliveCharacter({id})
            PowerStore.requireCharacters(1)
        }else{
            Modal.confirm({
                title: '确定要停用吗？',
                icon: <ExclamationCircleOutlined />,
                content:'停用后，属于该角色的所有用户都会被归为游客',
                cancelText:'取消',
                okText:'确定',
                async onOk() {
                    await stopCharacter({id})
                    PowerStore.requireCharacters(1)
                },
            });
        }
    }

    const deleteRow=async(id)=>{
        Modal.confirm({
            title: '你确定要删除吗？',
            icon: <ExclamationCircleOutlined />,
            content:'删除后，该角色的模块和权限都会清空，且无法恢复。属于该角色的所有用户都会被归为游客。',
            cancelText:'取消',
            okText:'确定',
            async onOk() {
                const res=await deleteCharacter({id})
                if(res.data.status===200){
                    PowerStore.requireCharacters()
                }
            },
        });
    }

    //编辑角色
    const editRow=async (record)=>{
        // 获取基本数据
        let {id,name,description,key}=record
        const res=await getModuleidAndRoleidByid({character_id:id})
        if(res.data.status===200){
            const InfoObj={
                base:{
                    id,
                    name,
                    description,
                    key
                },
                modules:res.data.moduleArr,
                roles:res.data.roleArr,
            }
            PowerStore.setEditInfo(JSON.stringify(InfoObj))
            PowerStore.setIsAddVisible(true)
        }
    }
    let columns = [
        {
            title: 'id',
            dataIndex: 'id',
            align:'center'
        },
        {
            title: '角色名称',
            dataIndex: 'name',
            align:'center'
        },
        {
            
            title: '描述',
            dataIndex: 'description',
            width:250,
            render: text => (
                <Tooltip placement="topLeft" title={text}>
                  {text}
                </Tooltip>
            ),
        },
        {
            title: '状态',
            dataIndex: 'state',
            align:'center',
            render: (text,record) => AdminStore.modules.operations.includes('characterUpdate')?
                    <Switch 
                        disabled={record.id===1||record.id===6} 
                        checkedChildren="正常"
                        unCheckedChildren="已停用"
                        checked={record.state}
                        onChange={(checked)=>{changeState(checked,record.id)}}
                    />:<span>{record.state?<span>正常</span>:<span style={{color:'red'}}>已停用</span>}</span>

        },
        {
            title: '操作',
            dataIndex: 'state',
            align:'center',
            render: (text,record) => {
                if((record.id===1||record.id===6)&&AdminStore.userInfo.character_id!==1){ //不删除超级管理员和游客
                    return '/'
                }else {
                    return <span>   
                       {
                            AdminStore.modules.operations.map(item=>{
                                if(item==='characterDelete'){return <Button danger size='small' icon={<DeleteFilled />} style={{marginRight:"1em"}} onClick={()=>{deleteRow(record.id)}}>删除</Button>}
                                if(item==='characterUpdate'){return <Button type='primary' size='small' icon={<EditOutlined />} onClick={()=>{editRow(record)}}>编辑</Button>}
                            })
                       }
                    </span>
                }
            }
        },
    ];

    
    return (
        <div>
            {
                AdminStore.modules.operations.includes('characterAdd')?
                <Button 
                    type='primary' 
                    style={{marginBottom:'1em',float:'right'}} 
                    onClick={()=>{
                        PowerStore.setEditInfo("")
                        PowerStore.setIsAddVisible(true)
                    }}>添加角色</Button>:''
            }
           <ModalComponent 
                isVisible={PowerStore.isAddVisible} 
                info={PowerStore.editInfo}
                close={(v)=>{
                    PowerStore.setIsAddVisible(false)
                    if(v==='ok'){
                        PowerStore.requireCharacters()
                    }
                }}
           />
            <Table 
                rowKey={item=>item.id}
                columns={AdminStore.modules.operations.some(item=>item==='characterDelete'||item==='characterUpdate')?columns:columns.slice(0,4)} 
                dataSource={PowerStore.charactersList?PowerStore.charactersList:[]} 
                pagination={{
                    pageSize:PowerStore.pageSize,
                    current:PowerStore.currentPage,
                    total:PowerStore.total,
                    onChange:(value)=>{PowerStore.setCurrentPage(value)}
                }}
            />
            
        </div>
    )
})