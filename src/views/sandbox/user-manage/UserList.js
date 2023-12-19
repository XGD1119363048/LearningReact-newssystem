import { Button, Modal, Switch, Table } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import UserForm from '../../../components/user-manage/UserForm';

const { confirm } = Modal

export default function UserList() {
  const [dataSource, setDataSource] = useState([])
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [regionList, setRegionList] = useState([])
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
  const [current, setCurrent] = useState(null)

  useEffect(() => {
    axios.get('http://localhost:5000/regions').then(res => {
      setRegionList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get('http://localhost:5000/roles').then(res => {
      setRoleList(res.data)
    })
  }, [])

  const {roleId, region, username} = JSON.parse(localStorage.getItem('token'))
  
  useEffect(() => {
    const roleObj = {
      '1': 'superadmin',
      '2': 'admin',
      '3': 'editor'
    }
    axios.get('http://localhost:5000/users?_expand=role').then(res => {
      setDataSource(roleObj[roleId] === 'superadmin' ? res.data : [...res.data.filter(item => item.username === username), ...res.data.filter(item => item.region === region && roleObj[item.roleId] === 'editor')])
    })
  }, [region, roleId, username])

  const addForm = useRef(null)
  const updateForm = useRef(null)

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value
        })),
        { text: '全球', value: '' }
      ],
      onFilter: (value, item) => item.region === value,
      render: (text) => {
        return <b>{text || '全球'}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      key: 'roleId',
      render: (role) => role?.roleName
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      key: 'roleState',
      render: (roleState, item) => <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)} />
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type='primary' shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => handleUpdate(item)} />
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} disabled={item.default} />
        </div>
      }
    }
  ];

  const handleUpdate = (item) => {
    setTimeout(() => {
      setIsUpdateVisible(true)
      if (item.roleId === 1) {
        // 禁用
        setIsUpdateDisabled(true)
      } else {
        // 取消禁用
        setIsUpdateDisabled(false)
      }
      updateForm.current.setFieldsValue(item)
    })
    setCurrent(item)
  }

  const handleChange = (item) => {
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    axios.patch(`http://localhost:5000/users/${item.id}`, {
      roleState: item.roleState
    })
  }

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
    axios.delete(`http://localhost:5000/users/${item.id}`)
  }

  const addFormOK = () => {
    addForm.current.validateFields().then(value => {
      // console.log(value)
      setIsAddVisible(false)
      // post 到后端生成id，再设置 dataSource，方便后续删除更新操作
      axios.post(`http://localhost:5000/users`, {
        ...value,
        roleState: true,
        default: false,
      }).then(res => {
        console.log(res.data)
        setDataSource([...dataSource, {
          ...res.data,
          role: roleList.filter(item => item.id === res.data.roleId)[0]
        }])
        addForm.current.resetFields()
      })
    }).catch(err => {
      console.log(err)
    })
  }

  const updateFormOK = () => {
    updateForm.current.validateFields().then(value => {
      setIsUpdateVisible(false)
      setIsUpdateDisabled(!isUpdateDisabled)
      
      axios.patch(`http://localhost:5000/users/${current.id}`, value).then(_ => {
        setDataSource(dataSource.map(item => {
          if (item.id === current.id) {
            return {
              ...item,
              ...value,
              role: roleList.filter(data => data.id === value.roleId)[0]
            }
          }
          return item
        }))
      })
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div>
      <Button type='primary' onClick={() => setIsAddVisible(true)}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} pagination={{
        pageSize: 5
      }} rowKey='id' />

      <Modal
        open={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => setIsAddVisible(false)}
        onOk={() => addFormOK()}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm} />
      </Modal>

      <Modal
        open={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateVisible(false)
          setIsUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => updateFormOK()}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true} />
      </Modal>

    </div>
  )
}
