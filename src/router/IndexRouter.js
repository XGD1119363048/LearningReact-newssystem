import React, { useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import axios from 'axios'

import Login from '../views/login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'

import Home from '../views/sandbox/home/Home'
import UserList from '../views/sandbox/user-manage/UserList'
import RoleList from '../views/sandbox/right-manage/RoleList'
import RightList from '../views/sandbox/right-manage/RightList'
import NoPermission from '../views/sandbox/nopermission/NoPermission'
import NewsAdd from '../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../views/sandbox/news-manage/NewsCategory'
import Audit from '../views/sandbox/audit-manage/Audit'
import AuditList from '../views/sandbox/audit-manage/AuditList'
import Unpublished from '../views/sandbox/publish-manage/Unpublished'
import Published from '../views/sandbox/publish-manage/Published'
import Sunset from '../views/sandbox/publish-manage/Sunset'
import NewsPreview from '../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../views/sandbox/news-manage/NewsUpdate'

const LocalRouterMap = {
  '/home': <Home />,
  '/user-manage/list': <UserList />,
  '/right-manage/role/list': <RoleList />,
  '/right-manage/right/list': <RightList />,
  '/news-manage/add': <NewsAdd />,
  '/news-manage/draft': <NewsDraft />,
  '/news-manage/category': <NewsCategory />,
  '/news-manage/preview/:id': <NewsPreview />,
  '/news-manage/update/:id': <NewsUpdate />,
  '/audit-manage/audit': <Audit />,
  '/audit-manage/list': <AuditList />,
  '/publish-manage/unpublished': <Unpublished />,
  '/publish-manage/published': <Published />,
  '/publish-manage/sunset': <Sunset />,
}

export default function IndexRouter() {
  const [backRouteList, setBackRouteList] = useState([])
  useEffect(() => {
    Promise.all([
      axios.get('/rights'),
      axios.get('/children')
    ]).then(res => {
      setBackRouteList([...res[0].data, ...res[1].data])
      // console.log([...res[0].data, ...res[1].data])
    })
  }, [])

  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && (item.pagepermisson === 1 || item.routepermisson)
  }

  const checkUserPermission = (item) => {
    const {role: {rights}} = JSON.parse(localStorage.getItem('token')) || {role: {}}
    return rights?.includes(item.key)
  }
  
  return (
    <HashRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<AuthComponent>
          <NewsSandBox />
        </AuthComponent>}>
          <Route path='/' element={<Navigate to='home' />} />
          {
            backRouteList.map(item => {
              if (checkRoute(item) && checkUserPermission(item)) {
                return <Route key={item.key} path={item.key.substring(1)} element={LocalRouterMap[item.key]} />
              }
              return null
            })
          }
          {
            backRouteList.length > 0 && <Route path='*' element={<NoPermission />} />
          }
        </Route>
      </Routes>
    </HashRouter>
  )
}

function AuthComponent({children}) {
  const isLogin = localStorage.getItem('token')
  return isLogin ? children : <Navigate to='/login' />
}
