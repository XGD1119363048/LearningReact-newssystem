import { Button } from 'antd'
import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Sunset() {
  const {dataSource} = usePublish(3)
  
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={<Button danger>删除</Button>}></NewsPublish>
    </div>
  )
}
