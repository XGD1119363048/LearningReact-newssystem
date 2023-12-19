import React, { useEffect } from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import { Outlet, useLocation } from 'react-router-dom'
import NProgress from 'nprogress'

import './NewsSandBox.css'
import 'nprogress/nprogress.css'

import { Layout, theme } from 'antd'
const { Content } = Layout;

export default function NewsSandBox() {
  const location = useLocation()
  useEffect(() => {
    NProgress.start()
    NProgress.done()
  }, [location])
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <SideMenu />
      <Layout>
        <TopHeader />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
