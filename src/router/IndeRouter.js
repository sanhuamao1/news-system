import React,{useEffect} from 'react'
import { AdminStore } from '../store';
import { Empty } from 'antd';
import {HashRouter, Route, Routes,Navigate } from 'react-router-dom'
import Login from '../views/Login/Login'
import Manage from '../views/Manage'
import NotFound from '../views/NotFound'
import Home from '../views/Home'
import UserList from '../views/userManage/UserList'
import CharacterList from '../views/powerManage/characterList'
import RoleList from '../views/powerManage/roleList'
import NewsCreate from '../views/newsManage/NewsCreate'
import NewsList from '../views/newsManage/NewsList'
import NewsDraft from '../views/newsManage/NewsDraft'
import NewsSort from '../views/newsManage/NewsSort'
import CheckList from '../views/checkManage/CheckList'
import PublishList from '../views/publishManage/PublishList'
import Center from '../views/userInfo/Center'

const pathRouterMap={
  "home":<Home/>,
  "user-manage/list":<UserList/>,
  "power-manage":<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无可操作模块"/>,
  "power-manage/characterlist":<CharacterList/>,
  "power-manage/rolelist":<RoleList/>,
  "news-manage":<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无可操作模块"/>,
  "news-manage/list":<NewsList/>,
  "news-manage/create":<NewsCreate/>,
  "news-manage/sort":<NewsSort/>,
  "news-manage/draft":<NewsDraft/>,
  "check-manage/list":<CheckList/>,
  "publish-manage":<PublishList/>
}

export default function IndeRouter() {
  return (
    <HashRouter>
        <Routes>
            <Route key="/" path="/" element={<RequireAuth>
                    <Manage/>
                </RequireAuth>}>
              <Route index element={<Home/>} key="indexhome"></Route>
              <Route path="/userinfo/center" element={<Center/>} key="userinfo/center"></Route>
              {
                AdminStore.modules.routerModules?.map(item=>
                  <Route path={item.key} element={pathRouterMap[item.key]} exact key={item.key}></Route>
                )
              }
            </Route>
            <Route path="/login" element={<Login/>} key="/login"></Route>
            
            {
                AdminStore.modules.routerModules!==undefined&&<Route path="*" element={<NotFound/>} key="notfound"></Route>
            }
            
        </Routes>
    </HashRouter>
  )
}

function RequireAuth({children}){
  const token=localStorage.getItem('token')
  return token?children:<Navigate to="/login"/>
}

