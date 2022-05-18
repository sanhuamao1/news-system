import React,{useEffect,useState} from 'react'
import AdminStore from '@/tstore/adminStore'
import { Layout, Menu } from 'antd';
import { HomeOutlined, TeamOutlined, ToolOutlined, ProfileOutlined, FileSearchOutlined, UploadOutlined,FileDoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
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

const titleStye={
  color: 'white',
  fontSize: '20px',
  lineHeight: '20px',
  textAlign: 'center',
  padding: '10px',
  borderBottom: '2px solid #eeeeee'
}

export default observer(()=> {
  const navigate = useNavigate()
  const [menus, setmenus] = useState([]);
  const changeMenu = ({ key }) => {
    navigate(key)
  }

  useEffect(() => {
    setmenus(AdminStore.modules.menuModules.map(item=>getItem(item)))
  }, []);

  
  return (
    <Sider collapsible collapsed={AdminStore.collapse}>
      <div style={{heith:'100%',display:'flex',flexDirection:'column'}}>
        <div style={{...titleStye}}>新闻发布管理系统</div>
        <div style={{flex:1,overflow:"auto"}}>
          <Menu
            onClick={changeMenu}
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['4']}
            items={menus}
          />
        </div>
      </div>
    </Sider>
  )
})
