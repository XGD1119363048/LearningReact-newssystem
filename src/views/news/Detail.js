import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'

import { PageHeader } from '@ant-design/pro-layout'
import { Descriptions, message } from 'antd'

import { HeartTwoTone } from '@ant-design/icons'

export default function Detail() {
  const [newsInfo, setNewsInfo] = useState(null)
  const [isStar, setIsStar] = useState(false)
  const params = useParams()
  useEffect(() => {
    // console.log(params.id)
    axios.get(`news/${params.id}?_expand=category&_expand=role`).then(res => {
      setNewsInfo({
        ...res.data,
        view: res.data.view + 1
      })
      return res.data
    }).then(res => {
      axios.patch(`/news/${params.id}`, {
        view: res.view + 1
      })
    })
  }, [params.id])

  const [messageApi, contextHolder] = message.useMessage();

  const items = newsInfo && [
    {
      key: '1',
      label: '创建者',
      children: newsInfo.author,
    },
    {
      key: '2',
      label: '发布时间',
      children: newsInfo.publishTime ? moment(newsInfo.publishTime).format('YYYY/MM/DD HH:mm:ss') : '-',
    },
    {
      key: '3',
      label: '区域',
      children: newsInfo.region,
    },
    {
      key: '4',
      label: '访问数量',
      children: newsInfo.view,
      contentStyle: {
        color: 'green'
      }
    },
    {
      key: '5',
      label: '点赞数量',
      children: newsInfo.star,
      contentStyle: {
        color: 'green'
      }
    },
    {
      key: '6',
      label: '评论数量',
      children: 0,
      contentStyle: {
        color: 'green'
      }
    },
  ]

  const handleStar = () => {
    if (isStar) {
      messageApi.info('不能重复点赞！');
      return
    }
    axios.patch(`/news/${params.id}`, {
      star: newsInfo.star + 1
    }).then(_ => {
      setNewsInfo({
        ...newsInfo,
        star: newsInfo.star + 1
      })
      setIsStar(true)
      messageApi.success('点赞成功');
    })
  }

  return (
    <div>
      {contextHolder}
      {
        newsInfo && <div>
          <PageHeader
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={<div>
              {newsInfo.category.title}
              <HeartTwoTone twoToneColor="#eb2f96" onClick={handleStar} />
            </div>}
          >
            <Descriptions size="small" column={3} items={items} />
          </PageHeader>

          <div dangerouslySetInnerHTML={{
            __html: newsInfo.content
          }} style={{
            // border: '1px solid grey',
            margin: '0 24px'
          }} />
        </div>
      }
    </div>
  )
}
