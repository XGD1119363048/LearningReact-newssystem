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

  const auditList = ['未审核', '审核中', '已通过', '未通过']
  const publishList = ['未发布', '待发布', '已上线', '已下线']
  const colorList = ['black', 'orange', 'green', 'red']
  const items = newsInfo && [
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
      children: auditList[newsInfo.auditState],
      contentStyle: {
        color: colorList[newsInfo.auditState]
      }
    },
    {
      key: '6',
      label: '发布状态',
      children: publishList[newsInfo.publishState],
      contentStyle: {
        color: colorList[newsInfo.auditState]
      }
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
      children: 0,
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

          <div dangerouslySetInnerHTML={{
            __html: newsInfo.content
          }} style={{
            border: '1px solid grey',
            margin: '0 24px'
          }} />
        </div>
      }
    </div>
  )
}
