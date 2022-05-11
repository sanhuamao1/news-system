import { Form, Input, Select,Modal} from 'antd';
import { UserStore} from '../../store/index';
import {addUser} from '../../request/user'
const AddModalComponent = (props) => {
    const [form]=Form.useForm()
    const handleSubmit=()=>{
        form.validateFields().then(values => {
            addUser(values).then(res=>{
                if(res.data.status===200){
                    form.resetFields()
                    props.close()
                }
            })
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
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
            <Form labelCol={{span: 6}} style={{width:'64%',margin:"0 auto"}} form={form} initialValues={{
                sex:"",
                id:2
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
                        {UserStore.characters?UserStore.characters.map(item=>
                            <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                        ):''}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddModalComponent