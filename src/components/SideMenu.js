import React,{useEffect,useState} from 'react'
import {AdminStore} from '../store/index';
import { Layout, Menu } from 'antd';
import { HomeOutlined, TeamOutlined, ToolOutlined, ProfileOutlined, FileSearchOutlined, UploadOutlined,FileDoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Sider } = Layout


//添加图标
const iconList={
  "home":<HomeOutlined />,
  "user-manage/list":<TeamOutlined />,
  "power-manage":<ToolOutlined />,
  "news-manage":<ProfileOutlined />,
  "check-manage/list":<FileSearchOutlined />,
  "publish-manage":<UploadOutlined/>,
  "check-manage":<FileDoneOutlined/>,
}
function getItem(item){
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
    setmenus(AdminStore.modules.menuModules.map(item=>getItem(item)))
  }, []);

 
  return (
    <Sider className='sider-container'>
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
