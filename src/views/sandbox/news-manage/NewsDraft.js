import { Button, Modal, Table } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, UploadOutlined } from '@ant-design/icons'
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const { confirm } = Modal

export default function NewsDraft() {
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    const {username} = JSON.parse(localStorage.getItem('token'))
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      key: 'title',
      render: (title) => title
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author'
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
          <Button shape="circle" icon={<EditOutlined />} />
          
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />

          <Button type='primary' shape="circle" icon={<UploadOutlined />} />
        </div>
      }
    }
  ];

  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除?',
      icon: <ExclamationCircleFilled />,
      // content: 'Some descriptions',
      onOk() {
        // console.log('OK');
        deleteMethod(item)
      },
      onCancel() {
        // console.log('Cancel');
      },
    })
  }

  const deleteMethod = (item) => {
    // console.log(item)
    // 当前页面同步状态 + 后端同步
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/news/${item.id}`)
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{
        pageSize: 5
      }} rowKey={item => item.id} />
    </div>
  )
}
