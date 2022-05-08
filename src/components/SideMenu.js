import React,{useEffect,useState} from 'react'
import { Layout, Menu } from 'antd';
import { HomeOutlined, TeamOutlined, ToolOutlined, ProfileOutlined, FileSearchOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {getMenus} from '../request/admin'
const { Sider } = Layout

//添加图标
const iconList={
  "/home":<HomeOutlined />,
  "/user-manage":<TeamOutlined />,
  "/power-manage":<ToolOutlined />,
  "/news-manage":<ProfileOutlined />,
  "/check-manage":<FileSearchOutlined />,
  "/publish-manage":<UploadOutlined/>
}
function getItem(item){
  if(item.children.length===0){
    delete item.children
  }
  return{
    ...item,
    icon:iconList[item.key]
  }
}
export default function SideMenu() {
  const navigate = useNavigate()
  const [menus, setmenus] = useState([]);
  const changeMenu = ({ key }) => {
    navigate(key)
  }
  

  useEffect(() => {
    getMenus().then(res=>{
      let data=res.data.data.map(item=>getItem(item))
      setmenus(data)
    })
  }, []);

 
  return (
    <Sider>
      <div className='sider-title'>新闻发布管理系统</div>
      <Menu
        onClick={changeMenu}
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['4']}
        items={menus}
      />
    </Sider>
  )
}
