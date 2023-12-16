import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './index.css'
import { Layout, Menu } from 'antd';
import {
  UserOutlined
} from '@ant-design/icons';
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

export default function SideMenu(props) {
  const navigate = useNavigate()
  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then(res => {
      let menuList = []
      res.data.forEach(item => {
        if (item.pagepermisson === 1) {
          let tmpMenu = {
            key: item.key,
            label: item.title,
            icon: iconList[item.key]
          }
          if (item.children && item.children.length > 0) {
            tmpMenu.children = item.children.filter(child => child.pagepermisson === 1).map(child => ({
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
  }, [])
  const [menu, setMenu] = useState([])
  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div className="demo-logo-vertical">全球新闻发布管理系统</div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['/home']}
        items={menu}
        onClick={({key}) => {
          navigate(key)
        }}
      />
    </Sider>
  )
}
