import React,{useEffect} from 'react'
import { Form, Select,Modal} from 'antd';
import {UserStore} from '../../store'
import {updateUser} from '../../request/user'
export default function EditModal(props) {

    useEffect(() => {
        if(props.isVisible){
            form.setFieldsValue({
                "character_id":JSON.parse(props.userinfo).character_id
            })
        }  
    }, [props.isVisible,props.userinfo]);
    
    const [form]=Form.useForm()
    const handleSubmit=()=>{
        form.validateFields().then(values => {
            updateUser({...values,id:JSON.parse(props.userinfo).id}).then(res=>{
                if(res.data.status===200){
                    form.resetFields()
                    props.getList()
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
                    {props.userinfo?JSON.parse(props.userinfo).username:''}
                </Form.Item>
                <Form.Item label="角色" name="character_id">
                    <Select>
                        { UserStore.characterAddOptions?.map(item=>
                            <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                        )}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
}