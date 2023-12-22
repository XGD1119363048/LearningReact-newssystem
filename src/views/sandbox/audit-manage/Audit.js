import React, { useEffect, useState } from 'react'
import axios from 'axios'

// antd
import { Button, notification, Table } from 'antd'
import { NavLink } from 'react-router-dom'

export default function Audit() {
  const [dataSource, setDataSource] = useState([])
  const {roleId, region, username} = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    const roleObj = {
      '1': 'superadmin',
      '2': 'admin',
      '3': 'editor'
    }
    axios.get('/news?auditState=1&_expand=category').then(res => {
      setDataSource(roleObj[roleId] === 'superadmin' ? res.data : [...res.data.filter(item => item.author === username), ...res.data.filter(item => item.region === region && roleObj[item.roleId] === 'editor')])
    })
  }, [region, roleId, username])

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
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger onClick={() => handleAudit(item, 3, 0)}>驳回</Button>
          <Button type='primary' onClick={() => handleAudit(item, 2, 1)}>通过</Button>
        </div>
      }
    }
  ];

  const handleAudit = (item, auditState, publishState) => {
    axios.patch(`/news/${item.id}`, {
      auditState,
      publishState
    }).then(res => {
      setDataSource(dataSource.filter(data => data.id !== item.id))
      notification.open({
        message: '通知',
        description:
          '您可以到【审核管理 / 审核列表】中查看您的新闻的审核状态',
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
