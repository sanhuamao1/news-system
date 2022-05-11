import React,{useState} from 'react'
import {AdminStore} from '../../store/index'
import { Form, Input, Button ,Card} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {registerRequest} from '../../request/admin';

const bgStyle={
    backgroundColor:"#36cfc9 ",
    height:"100vh",
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
}

export default function Login() {
    const [tab, settab] = useState(1);
    async function handleRegister(value){
        const res=await registerRequest(value)
        if(res.data.status===200){
          settab(1)
        }
    }
    function changeTab(type){
        settab(type)
    }
    return (
        <div style={{...bgStyle}}>
            <Card bordered>
                {
                    tab===1?
                    <LoginTab handleLogin={(value)=>{
                      AdminStore.requireLogin(value)
                    }} changeTab={changeTab}/>
                    :<RegiterTab handleRegister={handleRegister} changeTab={changeTab}/>
                }
            </Card>
        </div>
    )
}

function LoginTab(props){
  return <Form onFinish={props.handleLogin}>
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名!' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />}/>
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" style={{width:"100%"}} htmlType="submit">
          登录
        </Button>
        没有账号？<Button type="link" onClick={()=>{props.changeTab(2)}}>马上注册</Button>
      </Form.Item>
    </Form>
}


function RegiterTab(props){
  return <Form onFinish={props.handleRegister}>
      <Form.Item
        name="username"
        label="用户名"
        rules={[{ required: true, message: '请输入用户名!' }]}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[{ required: true, message: '请输入密码!' }]}
      >
        <Input/>
      </Form.Item>


      <Form.Item>
        <Button type="primary" style={{width:"100%"}} htmlType="submit">
          注册
        </Button>
        <Button type="link" onClick={()=>{props.changeTab(1)}}>返回登陆</Button>
      </Form.Item>
    </Form>
}
