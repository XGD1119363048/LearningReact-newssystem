import React from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from '../views/login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'

import Home from '../views/sandbox/home/Home'
import UserList from '../views/sandbox/user-manage/UserList'
import RoleList from '../views/sandbox/right-manage/RoleList'
import RightList from '../views/sandbox/right-manage/RightList'

export default function IndexRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<AuthComponent>
          <NewsSandBox />
        </AuthComponent>}>
          <Route index element={<Navigate to='home' />} />
          <Route path='home' element={<Home />} />
          <Route path='user-manage/list' element={<UserList />} />
          <Route path='right-manage/role/list' element={<RoleList />} />
          <Route path='right-manage/right/list' element={<RightList />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

function AuthComponent({children}) {
  const isLogin = localStorage.getItem('token')
  return isLogin ? children : <Navigate to='/login' />
}
