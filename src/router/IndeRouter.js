import React from 'react'
import { AdminStore } from '../store';
import { Empty } from 'antd';
import {HashRouter, Route, Routes,Navigate } from 'react-router-dom'
import Login from '../views/Login/Login'
import Manage from '../views/Manage'
import NotFound from '../views/NotFound'
import Home from '../views/Home'
import UserList from '../views/userManage/UserList'
import RoleList from '../views/powerManage/role/RoleList'
import CharacterList from '../views/powerManage/character/CharacterList'
import NewsCreate from '../views/newsManage/NewsCreate'
import NewsList from '../views/newsManage/NewsList'
import NewsDraft from '../views/newsManage/NewsDraft'
import NewsSort from '../views/newsManage/NewsSort'
import CheckList from '../views/checkManage/CheckList'
import PublishList from '../views/publishManage/PublishList'
import Center from '../views/userInfo/Center'

console.log('ok',AdminStore.modules.routerModules)
const pathRouterMap={
  "home":<Home/>,
  "user-manage/list":<UserList/>,
  "power-manage":<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无可操作模块"/>,
  "power-manage/roles":<RoleList/>,
  "power-manage/characters":<CharacterList/>,
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
            <Route path="/" element={<RequireAuth>
                    <Manage/>
                </RequireAuth>}>
              <Route index element={<Home/>}></Route>
              {
                AdminStore.modules.routerModules?.map(item=>
                  <Route path={item.key} element={pathRouterMap[item.key]} exact></Route>
                )
              }
              {/* <Route path="home" element={<Home/>}></Route>
              <Route path="userinfo/center" element={<Center/>}></Route>
              <Route path="user-manage/list" element={<UserList/>}></Route>

              <Route path="power-manage" element={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无可操作模块"/>}></Route>
              <Route path="power-manage/roles" element={<RoleList/>}></Route>
              <Route path="power-manage/characters" element={<CharacterList/>}></Route>    
              <Route path="news-manage" element={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无可操作模块"/>}></Route>
              <Route path="news-manage/list" element={<NewsList/>}></Route>
              <Route path="news-manage/create" element={<NewsCreate/>}></Route>  
              <Route path="news-manage/sort" element={<NewsSort/>}></Route>   
              <Route path="news-manage/draft" element={<NewsDraft/>}></Route>  
              <Route path="check-manage/list" element={<CheckList/>}></Route>      
              <Route path="publish-manage" element={<PublishList/>}></Route>       */}
            </Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="*" element={<NotFound/>}></Route>
        </Routes>
    </HashRouter>
  )
}

function RequireAuth({children}){
  const token=localStorage.getItem('token')
  return token?children:<Navigate to="/login"/>
}

