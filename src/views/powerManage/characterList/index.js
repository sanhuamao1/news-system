import React,{useEffect,useState,useRef} from 'react'
import {AdminStore} from '../../../store'
import { 
    ExclamationCircleOutlined,
    EditOutlined,
    DeleteFilled
} from '@ant-design/icons';
import { Button,Modal,Table,Tooltip,Switch } from 'antd';
import {
    getCharacters,
    stopCharacter,
    aliveCharacter,
    getModuleidAndRoleidByid,
    deleteCharacter
} from '../../../request/power'
import ModalComponent from './ModalComponent';

export default function CharacterList() {
    const [charactersList, setcharactersList] = useState([]);//角色列表
    const [isVisible, setisVisible] = useState(false);//模态框
    const [editInfo, seteditInfo] = useState("");
    //分页
    const {current:pageSize}=useRef(5)
    const [currentPage, setcurrentPage] = useState(1)
    const [total, settotal] = useState(0);

    const getCharactersList=(params)=>{
        getCharacters(params).then(res=>{
            if(res.data.status===200){
                setcharactersList(res.data.data)
                if(total!==res.data.total){settotal(res.data.total)}
            }
        })
    }
    //初始化
    useEffect(() => {
        getCharactersList({currentPage,pageSize})
    }, [currentPage]);
    
    const changeState=async(checked,id)=>{
        let res
        if(checked){
            res=await aliveCharacter({id})
            getCharactersList({currentPage,pageSize})
        }else{
            Modal.confirm({
                title: '确定要停用吗？',
                icon: <ExclamationCircleOutlined />,
                content:'停用后，属于该角色的所有用户都会被归为游客',
                cancelText:'取消',
                okText:'确定',
                async onOk() {
                    res=await stopCharacter({id})
                    getCharactersList({currentPage,pageSize})
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
                    getCharactersList({currentPage:1,pageSize})
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
            seteditInfo(JSON.stringify(InfoObj))
            setisVisible(true)
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
                if(record.id===1||record.id===6){ //不删除超级管理员和游客
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
                        seteditInfo("")//传入空字符，表示为为新建
                        setisVisible(true)
                    }}>添加角色</Button>:''
            }
           <ModalComponent 
                isVisible={isVisible} 
                info={editInfo}
                close={(v)=>{
                    setisVisible(false)
                    // 当提交成功后，传过来ok，提醒这边重新获取列表
                    if(v==='ok'){
                        getCharactersList({currentPage:1,pageSize})
                    }
                }}
           />
            <Table 
                rowKey={item=>item.id}
                columns={AdminStore.modules.operations.some(item=>item==='characterDelete'||item==='characterUpdate')?columns:columns.slice(0,4)} 
                dataSource={charactersList?charactersList:[]} 
                pagination={{
                    pageSize,
                    current:currentPage,
                    total,
                    onChange:(value)=>{setcurrentPage(value)}
                }}
            />
            
        </div>
    )
}