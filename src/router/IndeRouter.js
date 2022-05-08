import React from 'react'
import {HashRouter, Route, Routes,Navigate } from 'react-router-dom'
import Login from '../views/Login/Login'
import Manage from '../views/Manage'
import NotFound from '../views/NotFound'
import Home from '../views/Home'
import UserList from '../views/userManage/UserList'
import PowerList from '../views/powerManage/PowerList'
import CharacterList from '../views/powerManage/CharacterList'
import NewsCreate from '../views/newsManage/NewsCreate'
import NewsList from '../views/newsManage/NewsList'
import NewsDraft from '../views/newsManage/NewsDraft'
import CheckList from '../views/checkManage/CheckList'
import PublishList from '../views/publishManage/PublishList'
export default function IndeRouter() {
  return (
    <HashRouter>
        <Routes>
            <Route path="/" element={<RequireAuth>
                    <Manage/>
                </RequireAuth>}>
              <Route index element={<Home/>}></Route>
              <Route path="home" element={<Home/>}></Route>
              <Route path="user-manage/list" element={<UserList/>}></Route>
              <Route path="power-manage/power-list" element={<PowerList/>}></Route>
              <Route path="power-manage/charactor-list" element={<CharacterList/>}></Route>       
              <Route path="news-manage/list" element={<NewsList/>}></Route>
              <Route path="news-manage/create" element={<NewsCreate/>}></Route>      
              <Route path="news-manage/draft" element={<NewsDraft/>}></Route>    
              <Route path="check-manage/list" element={<CheckList/>}></Route>      
              <Route path="publish-manage" element={<PublishList/>}></Route>      

            </Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="*" element={<NotFound/>}></Route>
        </Routes>
    </HashRouter>
  )
}

function RequireAuth({children}){
    const isLogin=localStorage.getItem('token')
    return isLogin?children:<Navigate to="/login"/>
}

