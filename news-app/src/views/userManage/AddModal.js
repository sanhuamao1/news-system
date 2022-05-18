import { Form, Input, Select,Modal} from 'antd';
import {addUser} from '@/request/user'
import AdminStore from '@/tstore/adminStore'
import { observer } from 'mobx-react';
import { useStores } from '@/tstore/useStores'

const AddModal = observer((props) => {
    const {UserStore}=useStores()
    const [form]=Form.useForm()
    const handleSubmit=()=>{
        form.validateFields().then(values => {
            addUser(values).then(res=>{
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
            title="添加用户" 
            visible={props.isVisible} 
            onOk={handleSubmit} 
            onCancel={handleCancel}
        >
            <Form labelCol={{span: 8}} style={{margin:"0 2em"}} form={form} initialValues={{
                sex:"",
                character_id:2
            }}>
                <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
                    <Input/>
                </Form.Item>
                <Form.Item label="密码" name="password" rules={[{ required: true }]}>
                    <Input/>
                </Form.Item>
                <Form.Item label="邮箱" name="email">
                    <Input/>
                </Form.Item>
                <Form.Item label="性别" name="sex">
                    <Select>
                        <Select.Option value="女">女</Select.Option>
                        <Select.Option value="男">男</Select.Option>
                        <Select.Option value="">保密</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="角色" name="character_id">
                    <Select>
                        {
                            UserStore.characterOptions.map(item=>
                                <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)
                        }
                        {/* { AdminStore.userInfo.character_id===1?UserStore.characterOptions:UserStore.characterOptions.filter(item=>item.id!==1).map(item=>
                            <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                        )} */}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
})

export default AddModal