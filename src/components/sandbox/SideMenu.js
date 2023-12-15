import React from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'
import { Layout, Menu } from 'antd';
import {
  UserOutlined
} from '@ant-design/icons';
const { Sider } = Layout;

const menuList = [
  {
    key: '/home',
    label: '首页',
    icon: <UserOutlined />
  },
  {
    key: '/user-manage',
    label: '用户管理',
    icon: <UserOutlined />,
    children: [
      {
        key: '/user-manage/list',
        label: '用户列表',
        icon: <UserOutlined />
      }
    ]
  },
  {
    key: '/right-manage',
    label: '权限管理',
    icon: <UserOutlined />,
    children: [
      {
        key: '/right-manage/role/list',
        label: '角色列表',
        icon: <UserOutlined />
      },
      {
        key: '/right-manage/right/list',
        label: '权限列表',
        icon: <UserOutlined />
      }
    ]
  }
]

export default function SideMenu(props) {
  const navigate = useNavigate()
  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div className="demo-logo-vertical">全球新闻发布管理系统</div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['/home']}
        items={menuList}
        onClick={({key}) => {
          navigate(key)
        }}
      />
    </Sider>
  )
}
