import React,{useEffect} from 'react'
import { Form, Select,Modal} from 'antd';
import {updateUser} from '../../request/user'
import { observer } from 'mobx-react';
import { useStores } from '@/tstore/useStores'

export default observer((props)=> {
    const {UserStore}=useStores()

    useEffect(() => {
        if(props.isVisible){
            form.setFieldsValue({
                "character_id":JSON.parse(props.userInfo).character_id
            })
        }  
    }, [props.isVisible,props.userInfo]);
    
    const [form]=Form.useForm()

    const handleSubmit=()=>{
        form.validateFields().then(values => {
            updateUser({...values,id:JSON.parse(props.userInfo).id}).then(res=>{
                if(res.data.status===200){
                    form.resetFields()
                    props.getUserList()
                    props.close()
                }
            })
        })
    }
    const handleCancel=()=>{
      form.resetFields();
      props.close()
    }
    return (
        <Modal 
            title="编辑用户" 
            visible={props.isVisible} 
            okText="确定修改"
            cancelText="取消"
            onOk={handleSubmit} 
            onCancel={handleCancel}
        >
             <Form style={{margin:"0 2em"}} form={form}>
                <Form.Item label="用户名：">
                    {props.userInfo?JSON.parse(props.userInfo).username:''}
                </Form.Item>
                <Form.Item label="角色" name="character_id">
                    <Select>
                        { UserStore.characterOptions?.map(item=>
                            <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                        )}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
})