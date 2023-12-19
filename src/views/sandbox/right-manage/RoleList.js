import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, Tree } from 'antd'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import axios from 'axios'

const { confirm } = Modal

export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [rightList, setRightList] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRights, setCurrentRights] = useState([])
  const [currentId, setCurrentId] = useState(0)
  
  useEffect(() => {
    axios.get('http://localhost:5000/roles').then(res => {
      // console.log(res.data)
      setDataSource(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then(res => {
      // console.log(res.data)
      setRightList(res.data)
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
      render: (text) => <b>{text}</b>
    },
    {
      title: '角色名称',
      key: 'roleName',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render: (item) => <div>
        <Button type='primary' shape="circle" icon={<UnorderedListOutlined />} onClick={() => {
          setIsModalOpen(true)
          setCurrentRights(item.rights)
          setCurrentId(item.id)
        }} />
        <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
      </div>
    }
  ]

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
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:5000/roles/${item.id}`)
  }

  const handleOk = () => {
    setIsModalOpen(false);
    console.log(currentRights.checked ? currentRights.checked : currentRights)
    setDataSource(dataSource.map(item => {
      if(item.id === currentId) {
        return {
          ...item,
          rights: currentRights.checked ? currentRights.checked : currentRights
        }
      }
      return item
    }))
    axios.patch(`http://localhost:5000/roles/${currentId}`, {
      rights: currentRights.checked ? currentRights.checked : currentRights
    })
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onCheck = (checkedKeys) => {
    // console.log(checkedKeys)
    setCurrentRights(checkedKeys)
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey='id' />
      <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      <Tree
        checkable
        checkStrictly
        // defaultExpandedKeys={['0-0-0', '0-0-1']}
        // defaultSelectedKeys={['0-0-0', '0-0-1']}
        checkedKeys={currentRights}
        // onSelect={onSelect}
        onCheck={onCheck}
        treeData={rightList}
      />
      </Modal>
    </div>
  )
}
