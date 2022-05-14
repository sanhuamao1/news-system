import React,{ useState,useEffect} from 'react'
import {AdminStore} from '../store/index';
import { Layout,Avatar,Dropdown,Menu, Button,Upload ,message } from 'antd';
import { useNavigate } from 'react-router-dom';
const {Header}=Layout



export default function TopHeader() {
  const [imageUrl, setimageUrl] = useState('');
  const navigate=useNavigate()

  useEffect(() => {
    setimageUrl(AdminStore.userInfo.image_url)
  }, [imageUrl]);

  //上传图片
  const props = {
    name: 'image',
    action:'http://localhost:8080/upload/uploadimage',
    headers:{'Authorization':'Bearer ' + AdminStore.token},
    onChange(info){
      if (info.file.status === 'done') {
        AdminStore.requireUserInfo()
        setimageUrl(info.file.response.image_url)
        message.success('更新成功');
      } 
    }
  };

  const menu = (
    <Menu
      items={[
        {
          label:(<Button type="text" onClick={()=>{navigate('/userinfo/center')}}>个人中心</Button>),
        },
        {
          label:(
            <Upload {...props} >
              <Button type="text">更新头像</Button>
            </Upload>
          ),
        },
        {
          label:(<Button danger type="text" onClick={()=>{
            localStorage.clear()
            navigate('/login')
          }}>退出登录</Button>),
        }
      ]}
    />
  );

  return (
    <Header className="site-layout-background" style={{ padding: 0 }}>
      <span style={{float: 'right',paddingRight: '24px'}}>
        <span style={{paddingRight: '12px'}}>欢迎回来，{AdminStore.userInfo.username}</span>
        <Dropdown overlay={menu}>
          <Avatar 
            size="large" src={imageUrl}>
          </Avatar>
        </Dropdown>
      </span>
    </Header>
  )
}



