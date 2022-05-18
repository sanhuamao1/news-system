import React ,{useEffect} from 'react'
import AdminStore from '@/tstore/adminStore'
import { Steps,Form, Input,Modal,Tree,Button,message,Tag,Empty  } from 'antd';
import { ReconciliationOutlined,PartitionOutlined,KeyOutlined} from '@ant-design/icons';
import {isNewCharaterExist,isCharaterExist,getRolesByModule,addCharacter, updateCharacter} from '@/request/power'
import { useStores } from '@/tstore/useStores'
import { observer } from 'mobx-react';

// 一些样式
const formStyle={margin:"0 4em"}
const treeStyle={margin:"0 2em"}
const contentStyle={margin:'2em 0'}
const footerStyle={textAlign:'right'}

// 步骤条
const steps = [
    {
      title: '基本信息',
      icon:<ReconciliationOutlined />
    },
    {
      title: '分配模块',
      icon:<PartitionOutlined />
    },
    {
      title: '分配权限',
      icon:<KeyOutlined />
    },
];



export default observer((props)=> {
    const {PowerStore}=useStores()
    const [form]=Form.useForm()
    
    // 初始化模态框数据
    useEffect(() => {
        if(props.isVisible){
            PowerStore.requireAllOpenModules()
        }
        if(props.info===""&&props.isVisible){
            form.resetFields()
            PowerStore.setCheckedModules([])
            PowerStore.setCheckedRoles([])
            PowerStore.setCurrent(0)
        }else if(props.info!==""){
            const info=JSON.parse(props.info)
            //设置基本信息
            form.setFieldsValue({
                "name":info.base.name,
                "key":info.base.key,
                "description":info.base.description
            })
            PowerStore.setCheckedModules(info.modules)
            PowerStore.setCheckedRoles(info.roles)
            PowerStore.setCurrent(0)
        }
    }, [props.info,form,props.isVisible]);


    //下一步
    const next=async ()=>{
        //验证第一步
        if(PowerStore.current===0){
            let name=form.getFieldValue('name')
            let key=form.getFieldValue('key')
            // 判断是新建还是编辑
            let res
            if(props.info===''){
                res=await isNewCharaterExist({name,key})
            }else{
                res=await isCharaterExist({name,key,id:JSON.parse(props.info).base.id})
            }
            if(res.data.status!==200) return
        }
        //验证第二步
        if(PowerStore.current===1){
            if(PowerStore.checkedModules.length===0){
                message.error('模块不能为空！')
                return
            }
            //验证成功了，请求数据
            let moduleStr=PowerStore.checkedModules.join(',')
            const res=await getRolesByModule({moduleStr})
            if(res.data.status!==200) return
            PowerStore.setModuleRoles(res.data.data)
        }
        PowerStore.setCurrent(PowerStore.current+1)
    }

    //上一步
    const prev=()=>{
        PowerStore.setCurrent(PowerStore.current-1)
    }

    const handleSubmit=async ()=>{
        let data={
            base:{
                name:form.getFieldValue('name'),
                key:form.getFieldValue('key'),
                description:form.getFieldValue('description'),
            },
            modules:PowerStore.checkedModules.join(","),
            roles:PowerStore.checkedRoles.join(","),
        }
        // 判断是新增还是编辑
        let res
        if(props.info===""){
            res=await addCharacter({data:JSON.stringify(data)})
        }else{
            // 如果是编辑 补上id
            data.base.id=JSON.parse(props.info).base.id
            res=await updateCharacter({data:JSON.stringify(data)})
        }
        
        if(res.data.status===200){
            AdminStore.requireModules()
            props.close('ok')
        }
    }


    const roleChecked=(roleid,checked)=>{
        const nextCheckedRoles = checked ? [...PowerStore.checkedRoles, roleid] : PowerStore.checkedRoles.filter(t => t !== roleid);
        PowerStore.setCheckedRoles(nextCheckedRoles)
    }
    
    return (
        <Modal 
            title={props.info===""?"添加角色":"编辑角色"} 
            visible={props.isVisible} 
            footer={null}
            onCancel={props.close}
        >
            <Steps current={PowerStore.current}>
                {steps.map(item => (
                    <Steps.Step key={item.title} title={item.title} />
                ))}
            </Steps>


            {/* 展示区域 */}
            <div style={{...contentStyle}}>
                {
                    PowerStore.current===0&&(
                        <Form 
                            labelCol={{span: 8}} 
                            style={{...formStyle}} 
                            form={form} 
                        >
                            <Form.Item label="角色名称" name="name" rules={[{ required: true }]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item label="英文名称" name="key" rules={[{ required: true }]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item label="角色描述" name="description">
                                <Input/>
                            </Form.Item>
                        </Form>
                    )
                }
                {
                    PowerStore.current===1&&(
                        <Tree
                            style={{...treeStyle}}
                            fieldNames={{title:'name',key:'module_id'}}
                            checkStrictly={true}
                            defaultCheckedKeys={PowerStore.checkedModules}
                            checkable
                            treeData={PowerStore.allOpenModules}
                            onCheck={(keys)=>{
                                PowerStore.setCheckedModules(keys.checked)
                            }}
                        />
                    )
                }
                {
                    PowerStore.current===2&&(
                        <div>
                            {PowerStore.moduleRoles.length===0?<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="您所选择的模块中暂无操作权限"/>:PowerStore.moduleRoles.map(item=>{
                                return (
                                    <div style={{ marginRight: 8 }} key={item.module_name}>{item.module_name}：
                                    {
                                        item.roles.map(role=>{
                                            return (
                                                <Tag.CheckableTag
                                                    className='editTag'
                                                    key={role.role_id}
                                                    checked={PowerStore.checkedRoles.indexOf(role.role_id) > -1}
                                                    onChange={checked => roleChecked(role.role_id, checked)}
                                                >
                                                    {role.role_name}
                                                </Tag.CheckableTag>
    
                                            )
                                        })
                                    }
                                    </div>
                                )
                            })}
                        </div>
                    )
                }
            </div>
            {/* 操作区域 */}
            <div style={{...footerStyle}}>
                {PowerStore.current > 0 && (<Button style={{ margin: '0 8px' }} onClick={() => {prev()}}>上一步</Button>)}
                {PowerStore.current < steps.length - 1 && (<Button type="primary" onClick={() => {next()}}>下一步</Button>)}
                {PowerStore.current === steps.length - 1 && (<Button type="primary" onClick={handleSubmit}>提交</Button>)}
            </div>

        </Modal>
    );
})