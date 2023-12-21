import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'

import { PageHeader } from '@ant-design/pro-layout'
import { Descriptions } from 'antd'

export default function NewsPreview() {
  const [newsInfo, setNewsInfo] = useState(null)
  const params = useParams()
  useEffect(() => {
    // console.log(params.id)
    axios.get(`news/${params.id}?_expand=category&_expand=role`).then(res => {
      setNewsInfo(res.data)
    })
  }, [params.id])


  const items = [
    {
      key: '1',
      label: '创建者',
      children: newsInfo.author,
    },
    {
      key: '2',
      label: '创建时间',
      children: moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss'),
    },
    {
      key: '3',
      label: '发布时间',
      children: newsInfo.publishTime ? moment(newsInfo.publishTime).format('YYYY/MM/DD HH:mm:ss') : '-',
    },
    {
      key: '4',
      label: '区域',
      children: newsInfo.region,
    },
    {
      key: '5',
      label: '审核状态',
      children: newsInfo.auditState,
    },
    {
      key: '6',
      label: '发布状态',
      children: newsInfo.publishState,
    },
    {
      key: '7',
      label: '访问数量',
      children: newsInfo.view,
    },
    {
      key: '8',
      label: '点赞数量',
      children: newsInfo.star,
    },
    {
      key: '9',
      label: '评论数量',
      children: 'Lili Qu',
    },
  ]

  return (
    <div>
      {
        newsInfo && <div>
          <PageHeader
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={newsInfo.category.title}
          >
            <Descriptions size="small" column={3} items={items} />
          </PageHeader>
        </div>
      }
    </div>
  )
}
