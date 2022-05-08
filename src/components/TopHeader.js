import React,{useRef, useState} from 'react'
import { Layout,Avatar,Dropdown,Menu, Button  } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const {Header}=Layout

export default function TopHeader() {
  const [collapsed, setcollapsed] = useState(false);
  const navigate=useNavigate()
  const user=useRef('Tom')
  const changeCollapsed=()=>{
    setcollapsed(!collapsed)
  }
  const handleLogout=()=>{
    localStorage.clear()
    navigate('/login')
  }

  const menu = (
    <Menu
      items={[
        {
          label:'1st menu item',
        },
        {
          label:(<Button danger type="text" onClick={handleLogout}>退出登录</Button>),
        }
      ]}
    />
  );

  return (
    <Header className="site-layout-background" style={{ padding: 0 }}>
      {collapsed?<MenuUnfoldOutlined onClick={changeCollapsed}/>:<MenuFoldOutlined onClick={changeCollapsed}/>}
      <span style={{float: 'right',paddingRight: '24px'}}>
        <span style={{paddingRight: '12px'}}>欢迎回来</span>
        <Dropdown overlay={menu}>
          <Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} size="large">
            {user.current}
          </Avatar>
        </Dropdown>
      </span>
    </Header>
  )
}



