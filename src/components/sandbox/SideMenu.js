import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import './index.css'
import { Layout, Menu } from 'antd';
import {
  UserOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
const { Sider } = Layout;

const iconList = {
  '/home': <UserOutlined />,

  '/user-manage': <UserOutlined />,
  '/user-manage/list': <UserOutlined />,

  '/right-manage': <UserOutlined />,
  '/right-manage/role/list': <UserOutlined />,
  '/right-manage/right/list': <UserOutlined />,

  '/news-manage': <UserOutlined />,
  '/news-manage/add': <UserOutlined />,
  '/news-manage/draft': <UserOutlined />,
  '/news-manage/category': <UserOutlined />,

  '/audit-manage': <UserOutlined />,
  '/audit-manage/audit': <UserOutlined />,
  '/audit-manage/list': <UserOutlined />,

  '/publish-manage': <UserOutlined />,
  '/publish-manage/unpublished': <UserOutlined />,
  '/publish-manage/published': <UserOutlined />,
  '/publish-manage/sunset': <UserOutlined />
}

function SideMenu(props) {
  const [menu, setMenu] = useState([])

  const navigate = useNavigate()
  const location = useLocation()
  // console.log(location, location.pathname.split('/')[1])

  const checkPagePermission = useCallback(
    (item) => {
      const {role: {rights}} = JSON.parse(localStorage.getItem('token'))
      return item.pagepermisson === 1 && rights.includes(item.key)
    },
    [],
  )

  useEffect(() => {
    const {role: {rights}} = JSON.parse(localStorage.getItem('token'))
    axios.get('/rights?_embed=children').then(res => {
      let menuList = []
      res.data.forEach(item => {
        if (checkPagePermission(item)) {
          let tmpMenu = {
            key: item.key,
            label: item.title,
            icon: iconList[item.key]
          }
          if (item.children?.length > 0) {
            tmpMenu.children = item.children.filter(child => child.pagepermisson === 1 && rights.includes(child.key)).map(child => ({
              key: child.key,
              label: child.title,
              icon: iconList[child.key]
            }))
          }
          menuList.push(tmpMenu)
        }
      })
      setMenu(menuList)
    })
  }, [checkPagePermission])

  
  
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column'
      }}>
        <div className="demo-logo-vertical">全球新闻发布管理系统</div>
        <div style={{
          flex: 1,
          overflow: 'auto'
        }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={[`/${location.pathname.split('/')[1]}`]}
            items={menu}
            onClick={({ key }) => {
              navigate(key)
            }}
          />
        </div>
      </div>
    </Sider>
  )
}

const mapStateToProps = ({CollapsedReducer: {isCollapsed}}) => ({
  isCollapsed
})

export default connect(mapStateToProps)(SideMenu)
