import React from 'react'
import {AdminStore} from '../../store/index';
import { Form, Input, Select,Button} from 'antd';
import {updateUserInfo} from '../../request/admin'
const { Option } = Select;

const UserForm = ({user,submit}) => (
  <Form labelCol={{span: 4}} style={{width:'35%'}}  onFinish={submit} initialValues={{
      username:user.username,
      email:user.email,
      sex:user.sex
    }}>
    <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
      <Input/>
    </Form.Item>

    <Form.Item label="邮箱" name="email">
      <Input/>
    </Form.Item>

    <Form.Item label="性别" name="sex">
      <Select>
        <Option value="女">女</Option>
        <Option value="男">男</Option>
        <Option value="">保密</Option>
      </Select>
    </Form.Item>

    <Form.Item label="角色">
      <span>{AdminStore.characterList[Number(user.character_id)-1]}</span>
    </Form.Item>

    <Form.Item label="注册时间">
      <span>{user.create_time.replace("T", ' ').replace(".000Z","")}</span>
    </Form.Item>

    <Form.Item style={{float:'right'}}>
        <Button type="primary" htmlType="submit">
          确认修改
        </Button>
    </Form.Item>
  </Form>
);


export default function center() {
  const handleSubmit=async (value)=>{
    const res=await updateUserInfo({...value,id:AdminStore.userInfo.id})
    if(res.data.status===200){
      AdminStore.requireUserInfo()
      console.log(AdminStore.userInfo)
    }
  }
  return (
    <div>
      <UserForm user={AdminStore.userInfo} submit={handleSubmit}/>
    </div>
  )
}



