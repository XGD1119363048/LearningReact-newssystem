import React from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'

import { Outlet } from 'react-router-dom'

export default function NewsSandBox() {
  return (
    <div>
      <SideMenu />
      <TopHeader />

      <Outlet />
    </div>
  )
}
