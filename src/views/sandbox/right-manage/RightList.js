import { Button, Modal, Popover, Switch, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const { confirm } = Modal

export default function RightList() {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => {
        return <b>{text}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      render: (text) => {
        return <Tag color='orange'>{text}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Popover content={<div style={{textAlign: 'center'}}>
            <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)} />
          </div>} title="页面配置项" trigger="click">
            <Button type='primary' shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === void 0} />
          </Popover>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
        </div>
      }
    }
  ];
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      let list = res.data
      list.forEach(item => {
        if (item.children?.length === 0) {
          delete item.children
        }
      })
      setDataSource(list)
    })
  }, [])

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

  const switchMethod = (item) => {
    // console.log(item)
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setDataSource([...dataSource])
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    } else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }
  }

  const deleteMethod = (item) => {
    // console.log(item)
    // 当前页面同步状态 + 后端同步
    if (item.grade === 1) {
      setDataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`/rights/${item.id}`)
    } else {
      let list = dataSource.filter(data => data.id === item.rightId)
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      setDataSource([...dataSource])
      axios.delete(`/children/${item.id}`)
    }

  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{
        pageSize: 5
      }} />
    </div>
  )
}
