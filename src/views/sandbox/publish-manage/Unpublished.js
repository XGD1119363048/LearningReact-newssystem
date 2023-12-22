import { Button } from 'antd'
import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Unpublished() {
  const {dataSource} = usePublish(1)
  
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={<Button type='primary'>发布</Button>}></NewsPublish>
    </div>
  )
}
