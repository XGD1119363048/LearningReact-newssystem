import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'

// antd
import { Button, notification, Table, Tag } from 'antd'

export default function AuditList() {
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    const {username} = JSON.parse(localStorage.getItem('token'))
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [])

  const navigate = useNavigate()

  const colorList = ['', 'orange', 'green', 'red']
  const auditList = ['未审核', '审核中', '已通过', '未通过']

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      key: 'title',
      render: (title, item) => {
        return <NavLink to={`/news-manage/preview/${item.id}`}>{title}</NavLink>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => category.title
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      key: 'auditState',
      render: (auditState) => {
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {
            item.auditState === 1 && <Button onClick={() => handleRevert(item)}>撤销</Button>
          }
          {
            item.auditState === 2 && <Button type='primary' onClick={() => handlePublish(item)}>发布</Button>
          }
          {
            item.auditState === 3 && <Button danger onClick={() => handleUpdate(item)}>更新</Button>
          }
          
        </div>
      }
    }
  ];

  const handleRevert = (item) => {
    axios.patch(`/news/${item.id}`, {
      auditState: 0
    }).then(res => {
      setDataSource(dataSource.filter(data => data.id !== item.id))
      notification.info({
        message: '通知',
        description: '您可以到草稿箱中查看您的新闻',
        placement: 'bottomRight'
      })
    })
  }

  const handleUpdate = (item) => {
    navigate(`/news-manage/update/${item.id}`)
  }

  const handlePublish = (item) => {
    axios.patch(`/news/${item.id}`, {
      publishState: 2,
      publishTime: Date.now()
    }).then(res => {
      navigate('/publish-manage/published')
      notification.open({
        message: '通知',
        description:
          '您可以到【发布管理 / 已发布】中查看您的新闻',
        placement: 'bottomRight'
      });
    })
  }
  
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{
        pageSize: 5
      }} rowKey={item => item.id} />
    </div>
  )
}

