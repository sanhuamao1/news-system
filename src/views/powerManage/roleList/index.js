import React,{useEffect,useState} from 'react'
import { Table, Tag,Switch} from 'antd';
import {AdminStore} from '../../../store'
import {getAllModulesAndRoles,stopModule,aliveModule} from '../../../request/power'
export default function RoleList() {
    const [characterList, setcharacterList] = useState([]);
    useEffect(() => {
        requireModulesAndRoles()
    },[]);

    const requireModulesAndRoles=()=>{
        getAllModulesAndRoles().then(res=>{
            setcharacterList(res.data.data)
        })
    }
    const changeState= async (checked,id)=>{
        let res
        if(checked){
            res=await aliveModule({id})
        }else{
            res=await stopModule({id})
        }
        if(res.data.status===200){
            requireModulesAndRoles()
        }
    }
    const columns = [
        {
          title: '模块名称',
          dataIndex: 'name',
          key: 'name',
          width: '14%',
        },
        {
          title: '路由路径',
          dataIndex: 'key',
          key: 'key',
          width: '12%',
          render:(text)=><Tag color="#53A7CA">{text}</Tag>
        },
        {
            title: '操作权限',
            dataIndex: 'roles',
            key: 'roles',
            render:(roles)=>roles!==undefined?roles.map(role=><Tag color="#8CC5DD">{role.name}</Tag>):''
        },
        {
          title: '状态',
          dataIndex: 'state',
          key: 'state',
          align:'center',
          render: (text,record) => AdminStore.modules.operations.includes('moduleUpdate')?
                    <Switch 
                        checkedChildren="已开启"
                        unCheckedChildren="已关闭"
                        checked={record.state}
                        onChange={(checked)=>{changeState(checked,record.id)}}
                    />:<span>{record.state?<span>正常</span>:<span style={{color:'red'}}>已关闭</span>}</span>
        },
    ];
      
    return (
        <div>
            <Table
                rowKey={item=>item.id}
                columns={columns}
                dataSource={characterList}
                pagination={false}
            />
        </div>
    )
}